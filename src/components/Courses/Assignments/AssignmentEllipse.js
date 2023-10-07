import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Box, Menu, Paper, Typography, MenuItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ConfirmationDialog from 'reusables/ConfirmationDialog';
import {
  DELETE_ASSIGNMENT,
  UPDATE_ASSIGNMENT,
  EXPORT_RESULT_GRADES_ASSIGNMENT,
} from 'graphql/mutations/courses';
import { useMutation, useSubscription } from '@apollo/client';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { AssignmentStatus } from 'utils/constants';
import { SUBSCRIBE_NOTIFICATION } from 'graphql/queries/notification';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';

const Actions = {
  DELETE: 'delete',
  DISABLE: 'disable',
  ENABLE: 'enable',
};

const AssignmentEllipse = ({ anchorEl, onClose, status, onStatusChange }) => {
  const { userDetails } = useAuthenticatedUser();
  const [notificationData, setNotificationData] = useState(null);
  const classes = useStyles();
  const [actionType, setActionType] = useState(null);
  const { assignmentId } = useParams();
  const notification = useNotification();
  const history = useHistory();

  const [deleteAssignment, { loading: isDeletingAssignment }] = useMutation(DELETE_ASSIGNMENT, {
    onCompleted: () => {
      notification.success({
        message: 'Assignment deleted successfully',
      });
      setActionType(null);
      history.goBack();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: notify } = useSubscription(SUBSCRIBE_NOTIFICATION, {
    variables: {
      userId: userDetails?.id,
    },
    onSubscriptionData: (subscriptionData) => {
      setNotificationData(subscriptionData);
      if (notify && !loadingResults) {
        notification.success({
          message: 'Download',
          description: 'Your result has been downloaded',
        });
      }
    },
    onError: () => {
      notification.error({
        message: 'Failed',
        description: 'Failed to process result. Try again',
      });
    },
  });

  const [exportResult, { loading: loadingResults }] = useMutation(EXPORT_RESULT_GRADES_ASSIGNMENT, {
    onCompleted: (data) => {
      if (notify) {
        notification.success({
          message: 'Download',
          description: 'Your result has been downloaded',
        });
      } else {
        notification.info({
          message: 'Processing',
          description: `Processing result. Once complete,
  you will get a notification to download.`,
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  useEffect(() => {
    if (notify) {
      notification.success({
        message: 'Download',
        description: 'Your result has been downloaded',
      });
    }
    // else if (loadingResults) {
    //   notification.info({
    //     message: 'Processing',
    //     description: `Processing result. Once complete,
    // you will get a notification to download.`,
    //   });
    // }
  }, [notify || notificationData]);

  const [toggleStatus, { loading: isTogglingStatus }] = useMutation(UPDATE_ASSIGNMENT, {
    onCompleted: () => {
      onStatusChange();
      notification.success({
        message: `Assignment ${
          actionType === Actions.ENABLE ? 'enabled' : 'disabled'
        } successfully`,
      });
      setActionType(null);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const confirmationDialogHelperText = useMemo(() => {
    switch (actionType) {
      case Actions.DELETE:
        return {
          title: 'Are you sure you want to delete this assignment?',
          description: 'This action can not be revoke',
          okText: 'Delete Assignment',
        };
      case Actions.DISABLE:
        return {
          title: 'Are you sure you want to disable this assignment?',
          description: 'You can enable this assignment later',
          okText: 'Disable Assignment',
        };
      case Actions.ENABLE:
        return {
          title: 'Are you sure you want to enable this assignment?',
          description: 'You can disable this assignment later',
          okText: 'Enable Assignment',
        };
      default:
        return {
          title: null,
          description: null,
          okText: null,
        };
    }
  }, [actionType]);

  const handleToggleStatus = () => {
    toggleStatus({
      variables: {
        assignmentId,
        newAssignment: {
          status:
            actionType === Actions.ENABLE ? AssignmentStatus.PUBLISHED : AssignmentStatus.DRAFT,
        },
      },
    });
  };

  const handleDeleteAssignment = () => {
    deleteAssignment({
      variables: {
        id: assignmentId,
      },
    });
  };

  const handleOk = () => {
    switch (actionType) {
      case Actions.DISABLE:
      case Actions.ENABLE:
        handleToggleStatus();
        return;
      default:
        handleDeleteAssignment();
        return;
    }
  };

  const handleExportResult = () => {
    exportResult({
      variables: {
        assignmentId,
      },
    });
  };

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={onClose}
        style={{ marginTop: 110 }}
      >
        <Box component={Paper} px={5} pt={5} elevation={0}>
          <MenuItem>
            <ListItemText
              color="primary"
              primary=" Export Result"
              but
              onClick={() => {
                handleExportResult();
              }}
            />
          </MenuItem>
          <MenuItem>
            <Typography
              variant="h6"
              color="textPrimary"
              className={classes.action}
              onClick={() =>
                setActionType(status === AssignmentStatus.DRAFT ? Actions.ENABLE : Actions.DISABLE)
              }
            >
              {status === AssignmentStatus.DRAFT ? 'Enable' : 'Disable'}
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography
              variant="h6"
              color="textPrimary"
              className={classes.action}
              onClick={() => setActionType(Actions.DELETE)}
            >
              Delete
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
      <ConfirmationDialog
        {...confirmationDialogHelperText}
        onOk={handleOk}
        okButtonProps={{
          isLoading: isTogglingStatus || isDeletingAssignment,
          danger: actionType !== Actions.ENABLE ? true : false,
          color: actionType === Actions.ENABLE ? 'primary' : 'default',
        }}
        open={Boolean(actionType)}
        onClose={() => setActionType(null)}
      />
    </>
  );
};

const useStyles = makeStyles(() => ({
  action: {
    cursor: 'pointer',
    fontSize: 16,
    paddingBottom: 10,
  },
}));

export default AssignmentEllipse;
