import { ReactComponent as CSVIcon } from 'assets/svgs/csv_icon.svg';
import { ReactComponent as DefaultFileIcon } from 'assets/svgs/default_file_icon.svg';
import { ReactComponent as WordIcon } from 'assets/svgs/doc_icon.svg';
import { ReactComponent as JpgIcon } from 'assets/svgs/jpg_icon.svg';
import { ReactComponent as PdfIcon } from 'assets/svgs/pdf_icon.svg';
import { ReactComponent as PngIcon } from 'assets/svgs/png_icon.svg';
import { ReactComponent as PptIcon } from 'assets/svgs/ppt_icon.svg';
import { ReactComponent as XlsIcon } from 'assets/svgs/xls_icon.svg';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * This reusable renders the icon for different file types based on the extension passed
 * Accepts the listed file extensions and has a ffallback if none is supplied
 */
function FileTypeIcon(props) {
  let icon;
  let { iconType } = props;

  switch (iconType) {
    case 'pdf':
      icon = <PdfIcon />;
      break;

    case 'xlxs':
      icon = <XlsIcon />;
      break;

    case 'docx':
      icon = <WordIcon />;
      break;

    case 'ppt':
      icon = <PptIcon />;
      break;
    case 'png':
      icon = <PngIcon />;
      break;
    case 'jpg':
      icon = <JpgIcon />;
      break;

    case 'csv':
      icon = <CSVIcon />;
      break;

    default:
      icon = <DefaultFileIcon />;
      break;
  }

  return <div className="icon">{icon}</div>;
}

FileTypeIcon.propTypes = {
  iconType: PropTypes.string,
};

export default FileTypeIcon;
