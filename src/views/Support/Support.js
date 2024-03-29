import React, { useEffect, useCallback } from 'react';
import { useTranslation } from "react-i18next";

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
  Typography,
  CircularProgress,
  Tooltip,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  // TextField,
} from '@material-ui/core';
import {
  Person,
  EmojiEmotions,
  Image,
  Clear,
} from '@material-ui/icons';

import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import InfiniteScroll from 'react-infinite-scroller'
import TimeAgo from 'javascript-time-ago';
import zh from 'javascript-time-ago/locale/zh';

import Auth from "services/AuthService";
import ApiService from 'services/api/ApiService';
import ApiAuthService from 'services/api/ApiAuthService';
import ApiCustomerService from 'services/api/ApiCustomerService';
import { getSocket } from "services/SocketService";

import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

TimeAgo.addLocale(zh);

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 0,
  },
  userList: {
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    height: 'calc(100vh - 250px)',
  },
  chatBox: {
    padding: "0 15px !important",
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  chatTextAreaLeft: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#eeeeee',
    borderRadius: '8px',
    maxWidth: '80%',
  },
  chatTextAreaRight: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    borderRadius: '8px',
    float: 'right',
    maxWidth: '80%',
    color: '#ffffff',
  },
  chatBoxAvatarRight: {
    marginLeft: '16px',
  },
  chatInputArea: {
    width: '100%',
    padding: '7px 15px',
  },
  usersInfiniteScrollContainer: {
    height: 'calc(100vh - 250px)',
    overflow: 'auto',
  },
  messagesInfiniteScrollContainer: {
    height: 'calc(100vh - 440px)',
    overflow: 'auto',
  },
  spinnerContainer: {
    paddingTop: '5px',
    textAlign: 'center',
  },
  chatImage: {
    maxWidth: "300px",
    display: "block",
    cursor: "pointer",
  },
  imageInput: {
    display: "none",
  },
  imageContainer: {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    maxHeight: "200px",
  },
  imageClearButton: {
    position: "absolute",
    left: "0",
    height: "36px",
  },
  sendImage: {
    objectFit: "contain",
  },
  content: {
    width: "85%",
  },
  category: {
    marginBottom: "2px",
    fontSize: "12px",
    color: "black",
  },
}));

let socket = null;

export default function SupportPage() {

  const { t } = useTranslation();
  const classes = useStyles();
  const chatBoxRef = React.useRef(null);
  const chatInputRef = React.useRef(null);
  const timeAgo = new TimeAgo('zh-CN');

  const [message, setMessage] = React.useState('');
  const [emojiVisible, setEmojiVisible] = React.useState(false);
  // const [settingVisible, setSettingVisible] = React.useState(false);
  // const [users, setUsers] = React.useState([]);
  const [userData, setUserData] = React.useState({
    users: [],
    userId: ''
  });
  const [messages, setMessages] = React.useState([]);
  const [messagesList, setMessagesList] = React.useState([]);
  const [managerId, setManagerId] = React.useState("");
  const [managerImg, setManagerImg] = React.useState("");
  const [managerName, setManagerName] = React.useState("");
  // const [userId, setUserId] = React.useState("");
  const [isUserMore, setIsUserMore] = React.useState(true);
  const [userPage, setUserPage] = React.useState(-1);
  const [chatPage, setChatPage] = React.useState(0);
  const [isMessageMore, setIsMessageMore] = React.useState(false);
  // const [welcomeMessage, setWelcomeMessage] = React.useState("");
  const [category, setCategory] = React.useState("other");

  // for checking current message receiver is logged in or not
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  // for sending images
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [selectedMedia, setSelectedMedia] = React.useState(null);

  // for dynamic accumulation due to socket message
  const [userOffset, setUserOffset] = React.useState(0);
  const [chatOffset, setChatOffset] = React.useState(0);

  const { users, userId } = userData ?? {
    users: [],
    userId: ""
  };

  const PAGE_SIZE = 20;

  const queryMessage = useCallback(() => {
    if (userId && userId !== "") {
      // get messages
      let query = {};
      let pageSize = 30;
      let s_query = {
        where: {},
        options: {}
      };
      s_query.options.limit = pageSize;
      s_query.options.skip = chatOffset + pageSize * chatPage;

      query.query = JSON.stringify(s_query);
      ApiService.v2().get(`messages/chatmessages/${managerId}/${userId}`, query).then(({ data }) => {
        if (data.code === "success") {
          if (chatPage === 0) {
            setTimeout(() => {
              chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 200);
          }
          if (data.data.length < pageSize) {
            setIsMessageMore(() => false);
          }
          if (data.data.length > 0) {
            setMessages(() => JSON.parse(
              JSON.stringify(messagesList.concat(data.data))).reverse());
            setMessagesList((oldMessagesList) => oldMessagesList.concat(data.data));
            setChatPage((oldChatPage) => oldChatPage + 1);
          }
        }
      });
    }
  }, [userId, chatOffset, chatPage, managerId, messagesList]);

  const getTimeStr = (startTime) => {
    if (startTime) {
      return timeAgo.format(startTime);
    } else {
      return t("");
    }
  };

  const setUserId = useCallback((newUserId) => {
    setUserData((oldUserData) => {
      return { ...oldUserData, userId: newUserId };
    });
  }, []);

  const setUsers = (newUsers) => {
    setUserData((oldUserData) => {
      return { ...oldUserData, users: newUsers }
    });
  }

  const handleUserItemClick = useCallback((selectedUserId, userIndex) => {
    if (userId !== selectedUserId) {
      users[userIndex].unread = 0;
      setCategory(() => users[userIndex].category);
      setUserLoggedIn(() => users[userIndex].userNo === 0);
      setUserId(selectedUserId);
      setMessagesList(() => []);
      setMessages(() => []);
      setIsMessageMore(() => true);
      setChatPage(() => 0);
      setChatOffset(() => 0);
    }
  }, [userId, users, setUserId]);

  const handleSubmit = useCallback(() => {
    if (userId !== "") {
      if (message.trim() === '' && selectedMedia === null) {
        setMessage(() => '');
      } else {
        const selectedUserIndex = users.findIndex((u) => u._id === userId);
        if (selectedUserIndex > -1) {
          users[selectedUserIndex]['message'] = message === '' ? t('Image') : message;
          setUsers(users);
        }
        let newMessage = {
          message: message,
          image: selectedFile,
          sender: managerId,
          senderImg: managerImg,
          senderName: managerName,
          category: category,
          createdAt: Date.now()
        };
        setMessages((oldMessages) => [...oldMessages, newMessage]);
        setMessagesList((oldMessagesList) => [newMessage, ...oldMessagesList]);
        setChatOffset((oldChatOffset) => oldChatOffset + 1);
        setMessage(() => '');
        setSelectedMedia(() => null);
        setSelectedFile(() => "");
        setTimeout(() => {
          chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }, 200);
        // send data via socket
        newMessage.receiver = userId;
        newMessage.userLoggedIn = userLoggedIn;
        // console.log("SENDING DATA");
        // console.log(newMessage);
        socket.emit('admin_send', newMessage);
      }
    }
  }, [t, userId, users, message, selectedMedia, selectedFile, category, managerId, managerImg, managerName, userLoggedIn]);

  const receiveSocket = React.useCallback((data) => {
    let isNew = true;
    if (socket) {
      let newUsers;
      let flag = true;
      setUserData((oldUserData) => {
        if (flag) {
          flag = false;
          const { users: oldUsers, userId: oldUserId } = oldUserData;
          // check if this is from a new user or not and also if this is from a currently reading user
          let usersLength = oldUsers.length;
          for (let i = 0; i < usersLength; i++) {
            // if new message's sender is in list
            if (oldUsers[i]._id === data.sender) {
              isNew = false;
              // if it is currently viewing user's
              if (oldUserId === data.sender) {
                // reset messages
                ApiService.v2().get(`messages/reset/${data._id}`).then(({ data }) => {
                  if (data.code === "success") {
                    // reset messages ok
                  }
                });
                // just add message
                let messageData = {
                  _id: data.sender,
                  message: data.message,
                  image: data.image,
                  createdAt: data.createdAt,
                  senderImg: data.senderImg
                }
                setMessages((oldMessages) => oldMessages.concat(messageData));
                setMessagesList((oldMessagesList) => [messageData].concat(oldMessagesList));
                setChatOffset((oldChatOffset) => oldChatOffset + 1);
                setTimeout(() => {
                  if (chatBoxRef.current) {
                    chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                  }
                }, 200);
                // update current user's category 
                newUsers = [...oldUsers];
                newUsers[i].category = data.category;
              } else {
                const userItem = oldUsers.splice(i, 1)[0];
                userItem.unread = userItem.unread + 1;
                userItem.message = data.message !== "" ? data.message : t('Image Arrived');
                userItem.category = data.category;
                // oldUsers.unshift(userItem);
                newUsers = [userItem, ...oldUsers];
              }
              break;
            }
          }
          if (isNew) {
            newUsers = [{
              _id: data.sender,
              senderName: data.senderName,
              senderImg: data.senderImg,
              createdAt: data.createdAt,
              userNo: data.userNo,
              message: data.message ? data.message : t('Image arrived'),
              unread: 1
            }, ...oldUsers];
            setUserOffset((oldUserOffset) => oldUserOffset + 1);
          }
          setUserData({ ...oldUserData, users: newUsers });
        }
      });
    }
  }, [t]);

  const handleUploadClick = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedMedia(() => event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        setSelectedFile(reader.result);
      };
    }
    event.target.value = null;
  };

  const onClearImage = () => {
    setSelectedFile(() => "");
    setSelectedMedia(() => null);
  };

  // const getWelcomeMessage = () => {
  //   ApiService.v2().get(`setting`).then(({data}) => {
  //     console.log(data)
  //   });
  // }

  React.useEffect(() => {
    const token = Auth.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      if (data && data.code === "success") {
        setManagerId(data.data._id);
        setManagerName(data.data.username);
        setManagerImg(data.data.profileImg);
        // socket initialization
        socket = getSocket();
      }
    });
    return () => {
      socket = null;
    }
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.off('to_manager', receiveSocket).on('to_manager', receiveSocket);
    }
    // eslint-disable-next-line
  }, [socket, receiveSocket]);


  useEffect(() => {
    if (managerId) {
      ApiCustomerService.queryUser(0, 0, PAGE_SIZE).then(({ data }) => {
        if (data.code === "success") {
          if (data.data.length < PAGE_SIZE) {
            setIsUserMore(false);
          }
          if (data.data.length > 0) {
            setUsers(data.data);
            setUserPage(0);
          }
        }
      });
    }
  }, [managerId]);

  const loadMore = useCallback(() => {
    if (userPage < 0) {
      return;
    }
    ApiCustomerService.queryUser(userPage + 1, userOffset, PAGE_SIZE).then(({ data }) => {
      if (data.code === "success") {
        if (data.data.length < PAGE_SIZE) {
          setIsUserMore(() => false);
        }
        if (data.data.length > 0) {
          setUsers(data.data);
          setUserPage((oldUserPage) => oldUserPage + 1);
        }
      }
    });

  }, [userPage, userOffset]);

  // const handleCancel = () => {
  //   setSettingVisible(false);
  // }

  // const handleChangeMessage = () => {
  //   console.log(this.welcomeMessage);
  // }

  // const handleWelcomeMessageChange = ({ target }) => {
  //   const str = target.value;
  //   setWelcomeMessage(target.value);
  // }

  const getCategoryName = (curCategory) => {
    if (curCategory === "problem") {
      return t("Product / Delivery problems");
    } else if (curCategory === "order") {
      return t("Change or Cancel Order");
    } else if (curCategory === "support") {
      return t("Technical Support");
    } else {
      return t("Other");
    }
  };

  // const download = (fileUrl) => {
  //   console.log(fileUrl)
  //   var element = document.createElement("a");
  //   var file = new Blob(
  //     [
  //       fileUrl
  //     ],
  //     { type: "image/*" }
  //   );
  //   element.href = URL.createObjectURL(file);
  //   element.download = fileUrl.split("/").pop();
  //   element.click();
  // };

  const download = e => {
    const fileUrl = e.target.src;
    fetch(fileUrl, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileUrl.split("/").pop()); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <GridContainer>
      <Card
        className={classes.container}
      >
        <CardHeader color="primary">
          {t('Support')}
        </CardHeader>
        <CardBody>
          <GridContainer>
            <Grid item className={classes.userList} xs={3}>
              <div
                className={classes.usersInfiniteScrollContainer}
              >
                <InfiniteScroll
                  pageStart={0}
                  loadMore={loadMore}
                  hasMore={isUserMore}
                  loader={
                    <div
                      key="user-spinner"
                      className={classes.spinnerContainer}
                    >
                      <CircularProgress
                        size={20}
                      />
                    </div>
                  }
                  useWindow={false}
                  threshold={1}
                >
                  <List>
                    {
                      users.map((user, index) => {
                        return (
                          <React.Fragment
                            key={`user-${index}`}
                          >
                            <ListItem
                              button
                              onClick={() => handleUserItemClick(user._id, index)}
                            >
                              <ListItemAvatar>
                                <Badge
                                  color="secondary"
                                  badgeContent={user.unread}
                                  overlap="circle"
                                >
                                  {user.senderImg === ""
                                    ? <Avatar><Person /></Avatar>
                                    : <Avatar alt={user.senderName} src={user.senderImg} />
                                  }
                                </Badge>
                              </ListItemAvatar>
                              <ListItemText
                                primary={user.senderName ? user.senderName : `${t("User")} ${user.userNo} (${getCategoryName(user.category)})`}
                                secondary={
                                  <Typography
                                    noWrap={true}
                                    variant="body2"
                                    color="textSecondary"
                                    className={classes.content}
                                  >
                                    {user.message}
                                  </Typography>
                                }
                              />
                              <ListItemSecondaryAction>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="textPrimary"
                                >
                                  {getTimeStr(user.createdAt)}
                                </Typography>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider variant="inset" />
                          </React.Fragment>
                        );
                      })
                    }
                  </List>
                </InfiniteScroll>
              </div>
            </Grid>
            <GridItem xs={9}>
              <GridContainer>
                <Grid className={classes.chatBox} item xs={12}>
                  <div
                    className={classes.messagesInfiniteScrollContainer}
                  >
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={queryMessage}
                      hasMore={isMessageMore}
                      isReverse={true}
                      loader={
                        <div
                          key="message-spinner"
                          className={classes.spinnerContainer}
                        >
                          <CircularProgress
                            size={20}
                          />
                        </div>
                      }
                      useWindow={false}
                      threshold={1}
                    >
                      <List
                        ref={chatBoxRef}
                      >
                        {messages.map((messageItem, index) => {
                          if (messageItem.sender !== managerId) {
                            return (
                              <ListItem
                                key={`message-${index}`}
                                alignItems="flex-start"
                              >
                                <ListItemAvatar>
                                  {messageItem.senderImg === ""
                                    ? <Avatar><Person /></Avatar>
                                    : <Avatar alt={messageItem.senderName} src={messageItem.senderImg} />
                                  }
                                </ListItemAvatar>
                                <ListItemText
                                  primary=""
                                  secondary={
                                    <span
                                      className={classes.chatTextAreaLeft}
                                    >
                                      <Typography
                                        component="span"
                                        variant="body1"
                                        color="textPrimary"
                                      >
                                        {messageItem.image &&
                                          <Tooltip title={t("You can download this image")}>
                                            <img className={classes.chatImage} src={messageItem.image} alt="chat" onClick={(e) => download(e)} />
                                          </Tooltip>
                                        }
                                        {messageItem.message}
                                      </Typography>
                                    </span>
                                  }
                                />
                              </ListItem>
                            );
                          } else {
                            return (
                              <ListItem
                                key={`message-${index}`}
                                alignItems="flex-start"
                              >
                                <ListItemText
                                  primary=""
                                  secondary={
                                    <span
                                      className={classes.chatTextAreaRight}
                                    >
                                      <Typography
                                        component="span"
                                        variant="body1"
                                      >
                                        {messageItem.image &&
                                          <img className={classes.chatImage} src={messageItem.image} alt="chat" />
                                        }
                                        {messageItem.message}
                                      </Typography>
                                    </span>
                                  }
                                />
                                <ListItemAvatar>
                                  <Avatar
                                    className={classes.chatBoxAvatarRight}
                                    src={messageItem.senderImg}
                                  />
                                </ListItemAvatar>
                              </ListItem>
                            );
                          }
                        })}
                      </List>
                    </InfiniteScroll>
                  </div>
                </Grid>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12}>
                  {selectedMedia &&
                    <div className={classes.imageContainer}
                    >
                      <IconButton
                        color="primary"
                        aria-label="close"
                        component="span"
                        className={classes.imageClearButton}
                        onClick={() => onClearImage()}
                      >
                        <Clear />
                      </IconButton>
                      <img src={selectedFile} className={classes.sendImage} alt="chat" />
                    </div>
                  }
                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      color="primary"
                      aria-label="emoji"
                      component="span"
                      onClick={() => setEmojiVisible(!emojiVisible)}
                    >
                      <EmojiEmotions />
                    </IconButton>
                    <input
                      accept="image/*"
                      className={classes.imageInput}
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={handleUploadClick}
                    />
                    <label htmlFor="contained-button-file">
                      <IconButton
                        color="primary"
                        aria-label="image"
                        component="span"
                      >
                        <Image />
                      </IconButton>
                    </label>
                    {emojiVisible && (
                      <Picker
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          zIndex: 9,
                        }}
                        title="DUOCUN"
                        showPreview={false}
                        showSkinTones={false}
                        onSelect={(val) => {
                          setMessage(message + val.native);
                          setTimeout(() => setEmojiVisible(false), 300);
                          chatInputRef.current.focus();
                        }}
                      />
                    )}
                    {/* <IconButton
                      color="primary"
                      aria-label="emoji"
                      component="span"
                      onClick={() => setSettingVisible(!settingVisible)}
                    >
                      <Settings />
                    </IconButton> */}
                    {/* <Dialog open={settingVisible} onClose={handleCancel} aria-labelledby="form-dialog-title">
                      <DialogTitle id="form-dialog-title">{t('Welcome Message Setting')}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {t('You can set the welcome message that will appear in the inquiry form of customer service page.')}
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label={t('Welcome Message')}
                          value={welcomeMessage}
                          onChange="handleWelcomeMessageChange"
                          fullWidth
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCancel} color="primary">
                          {t('Cancel')}
                        </Button>
                        <Button onClick={handleChangeMessage} color="primary">
                          {t('Save')}
                        </Button>
                      </DialogActions>
                    </Dialog> */}
                  </div>
                  <InputBase
                    inputRef={chatInputRef}
                    className={classes.chatInputArea}
                    autoFocus
                    multiline
                    rows="5"
                    placeholder={t('Type a message...')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e && e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <div
                    style={{
                      margin: '0 15px',
                      textAlign: 'right',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disableElevation
                      onClick={handleSubmit}
                    >
                      {t('Send')}
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </GridContainer>
  );
}