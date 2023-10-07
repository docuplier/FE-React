import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { PrivatePaths } from 'routes';
import { UserRoles } from 'utils/constants';

export const useRoleNavigation = () => {
  const { userDetails } = useAuthenticatedUser();
  const institutionId = userDetails?.institution?.id;

  const navLinkEnum = {
    [UserRoles.DFA_ADMIN]: { link: `${PrivatePaths.DFA_DASHBOARD}` },
    [UserRoles.GLOBAL_ADMIN]: {
      navArray: [
        { tabName: 'Dashboard', link: `${PrivatePaths.DFA_DASHBOARD}`, id: Math.random() },
        { tabName: 'Institutions', link: `${PrivatePaths.INSTITUTIONS}`, id: Math.random() },
        { tabName: 'Library', link: PrivatePaths.LIBRARY, id: Math.random() },

        { tabName: 'Announcement', link: PrivatePaths.ANNOUNCEMENT, id: Math.random() },
        { tabName: 'Executive', link: PrivatePaths.EXECUTIVE, id: Math.random() },
      ],
    },
    [UserRoles.SCHOOL_ADMIN]: {
      navArray: [
        { tabName: 'Dashboard', link: `${PrivatePaths.DFA_DASHBOARD}`, id: Math.random() },
        {
          tabName: 'School',
          link: `${PrivatePaths.DFA_INSTITUTIONS}/${institutionId}`,
          id: Math.random(),
        },
        { tabName: 'Users', link: `${PrivatePaths.DFA_USERS}`, id: Math.random() },
        {
          tabName: 'Courses',
          link: `${PrivatePaths.COURSES}`,
          id: Math.random(),
        },
        { tabName: 'Library', link: PrivatePaths.LIBRARY, id: Math.random() },
        { tabName: 'Activity Log', link: PrivatePaths.ACTIVITY_LOG, id: Math.random() },
        { tabName: 'Announcement', link: PrivatePaths.ANNOUNCEMENT, id: Math.random() },
        { tabName: 'Live Session', link: PrivatePaths.LIVE_SESSION, id: Math.random() },
        { tabName: 'Assessments', link: PrivatePaths.ASSESSMENTS, id: Math.random() },
      ],
    },
    [UserRoles.STUDENT]: {
      navArray: [
        { tabName: 'Dashboard', link: `${PrivatePaths.DASHBOARD}`, id: Math.random() },
        {
          tabName: 'My Learning',
          link: `${PrivatePaths.MY_LEARNING}`,
          id: Math.random(),
        },
        { tabName: 'Course', link: `${PrivatePaths.COURSES}`, id: Math.random() },
        { tabName: 'Library', link: PrivatePaths.LIBRARY, id: Math.random() },
        { tabName: 'Announcement', link: PrivatePaths.ANNOUNCEMENT, id: Math.random() },
        { tabName: 'Live Session', link: PrivatePaths.LIVE_SESSION, id: Math.random() },
      ],
    },
    [UserRoles.LECTURER]: {
      navArray: [
        { tabName: 'Dashboard', link: `${PrivatePaths.DASHBOARD}`, id: Math.random() },
        { tabName: 'Course', link: `${PrivatePaths.COURSES}`, id: Math.random() },
        { tabName: 'Library', link: PrivatePaths.LIBRARY, id: Math.random() },

        { tabName: 'Announcement', link: PrivatePaths.ANNOUNCEMENT, id: Math.random() },
        { tabName: 'Live Session', link: PrivatePaths.LIVE_SESSION, id: Math.random() },
      ],
    },
    DEFAULT: {
      navArray: [{ tabName: '', link: '', id: Math.random() }],
    },
  };

  const handleRoleBasedNav = (role = 'DEFAULT') => {
    return navLinkEnum[UserRoles[role]]?.navArray;
  };

  return {
    handleRoleBasedNav,
  };
};
