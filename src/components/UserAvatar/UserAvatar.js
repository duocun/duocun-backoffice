import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";

const UserAvatar = (props) => (
  <Avatar {...props} alt={props.user.username} src={props.user.imageurl}>
    {props.user.imageurl
      ? null
      : String(props.user.username)
          .substring(0, 2)
          .toUpperCase() || "U"}
  </Avatar>
);

UserAvatar.defaultProps = {
  onClick: () => {},
};

UserAvatar.propTypes = {
  user: PropTypes.object,
  onClick: PropTypes.func,
};

export default UserAvatar;
