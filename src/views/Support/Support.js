import React from 'react';
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
} from '@material-ui/core';
import {
  Person,
  EmojiEmotions,
  Settings,
  Image,
  Clear,
  PhotoSizeSelectLargeOutlined,
} from '@material-ui/icons';

import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import InfiniteScroll from 'react-infinite-scroller'

import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Auth from "services/AuthService";
import ApiService from 'services/api/ApiService';
import ApiAuthService from 'services/api/ApiAuthService';
import { buildQuery, buildPaginationQuery } from "helper/index";
import FlashStorage from "services/FlashStorage";
import { getSocket } from "services/SocketService";
import TimeAgo from 'javascript-time-ago';
import zh from 'javascript-time-ago/locale/zh';

// for setting welcome message by admin
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from '@material-ui/core/TextField';

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
  chatInputBox: {

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
    display: "block"
  },
  imageInput: {
    display: "none"
  },
  imageContainer: {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    maxHeight: "200px"
  },
  imageClearButton: {
    position: "absolute",
    left: "0",
    height: "36px"    
  },
  sendImage:{
    objectFit: "contain"
  }

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
  const [settingVisible, setSettingVisible] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [messagesList, setMessagesList] = React.useState([]);
  const [managerId, setManagerId] = React.useState("");
  const [managerImg, setManagerImg] = React.useState("");
  const [managerName, setManagerName] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [isUserMore, setIsUserMore] = React.useState(true);
  const [userPage, setUserPage] = React.useState(0);
  const [chatPage, setChatPage] = React.useState(0);
  const [isMessageMore, setIsMessageMore] = React.useState(false);
  const [welcomeMessage, setWelcomeMessage] = React.useState("");

  // for checking current message receiver is logged in or not
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  // for sending images
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [selectedMedia, setMedia] = React.useState(null);

  // for dynamic accumulation due to socket message
  const [userOffset, setUserOffset] = React.useState(0);
  const [chatOffset, setChatOffset] = React.useState(0);
  
  const [alert, setAlert] = React.useState(
    FlashStorage.get("ATTRIBUTE_ALERT") || { message: "", severity: "info" }
  );


  const queryUser = () => {
    if(managerId && managerId !== ""){
      let query = {};
      let s_query = {
        where: {},
        options: {}
      };
      let pageSize = 20;
      s_query.options.limit = pageSize;
      s_query.options.skip = userOffset + pageSize * userPage;

      query.query = JSON.stringify(s_query);
      ApiService.v2().get("messages/chatusers", query).then( ({data}) => {
        if(data.code === "success"){
          if(data.data.length < pageSize){
            setIsUserMore(false);
          }
          if(data.data.length > 0){        
            setUsers(users.concat(data.data));
            // if(userPage === 0){
            //   setUserId(data.data[0]._id);
            // }
          }
          setUserPage(userPage + 1);
        }
      }).catch(e => {
        console.error(e);
        setAlert({
          message: t("Data not found"),
          severity: "error"
        });
      });
    }
  };

  const queryMessage = () => {
    console.log("IMHERE");
    if(userId && userId !== ""){
      // get messages
      let query = {};
      let conditions = {};      
      let pageSize = 30;

      let s_query = {
        where: {},
        options: {}
      };
      s_query.options.limit = pageSize;
      s_query.options.skip = chatOffset + pageSize * chatPage;

      query.query = JSON.stringify(s_query);
      console.log(query);
      ApiService.v2().get(`messages/chatmessages/${managerId}/${userId}`, query).then(({data}) => {

        if(data.code === "success"){
          if(chatPage === 0){
            setTimeout(() => {
              chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 200);
          }
          console.log(data.data);
          if(data.data.length < pageSize){
            setIsMessageMore(false);
          }
          if(data.data.length > 0){
            setMessages(JSON.parse(
              JSON.stringify(messagesList.concat(data.data))).reverse());
            setMessagesList(messagesList.concat(data.data));
            setChatPage(chatPage + 1);
          }
        }
      }).catch(e => {
        console.error(e);
        setAlert({
          message: t("Data not found"),
          severity: "error"
        });
      });
    }

  };

  const getTimeStr = (startTime) => {
    if(startTime){
      return timeAgo.format(startTime);
    }else{
      return t("");
    }
  }

  const handleUserItemClick = (selectedUserId, userIndex) => {
    if(userId !== selectedUserId){
      users[userIndex].unread = 0;
      setUserLoggedIn(users[userIndex].userNo === 0);
      setUserId(selectedUserId);
      setMessagesList([]);
      setMessages([]);
      setIsMessageMore(true);
      setChatPage(0);
      setChatOffset(0);
    }
  }

  const handleSubmit = () => {
    if(userId !== ""){
      if (message.trim() === '' && selectedMedia === null) {
        setMessage('');
      } else {
        let newMessage = {
          message: message,
          image: selectedFile,
          sender: managerId,
          senderImg: managerImg,
          senderName: managerName,
          createdAt: Date.now()
        };
        setMessages([...messages, newMessage]);
        setMessagesList([newMessage, ...messagesList]);
        setChatOffset(chatOffset + 1);
        setMessage('');
        setMedia(null);
        setSelectedFile("");
        setTimeout(() => {
          chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }, 1000);

        // send data via socket
        newMessage.receiver = userId;
        newMessage.userLoggedIn = userLoggedIn;
        console.log("SENDING DATA");
        console.log(newMessage);
        socket.emit('admin_send', newMessage);
      }
    }else{
      setAlert({
        message: t("Please select customer"),
        severity: "error"
      });
    }
  };

  const receiveSocket = (socket) => {
    socket.off("connect").on("connect", (data) => {
      console.log('auto connect');
    });

    socket.off('id').on('id', (data) => {
      console.log(`my id is ${data}`);      
    });

    socket.off('to_manager').on('to_manager', (data) => {
      console.log(data);
      // check if this is from a new user or not and also if this is from a currently reading user
      let usersLength = users.length;
      let isNew = true;
      for(let i = 0; i < usersLength; i++){
        // if new message's sender is in list
        console.log(users[i]._id, data.sender);
        if(users[i]._id === data.sender){
          isNew = false;
          // if it is currently viewing user's
          if(userId === data.sender){

            // reset messages
            ApiService.v2().get(`messages/reset/${data._id}`).then(({data}) => {
              if(data.code === "success"){
                // reset messages ok
                console.log(data.data)
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
            setMessages(messages.concat(messageData));
            setMessagesList([messageData].concat(messagesList));
            setChatOffset(chatOffset + 1);
            setTimeout(() => {
              chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 200);
          }else{
            const userItem = users.splice(i, 1)[0];
            userItem.unread = userItem.unread + 1;
            userItem.message = data.message !== "" ? data.message: t('Image Arrived');
            // users.unshift(userItem);
            console.log(users);
            setUsers([ userItem, ...users ]);            
          }
          break;
        }
      }
      if(isNew){
        setUsers([{
          _id: data.sender,
          senderName: data.senderName,
          senderImg: data.senderImg,
          createdAt: data.createdAt,
          userNo: data.userNo,
          message: data.message ? data.message: t('Image arrived'),
          unread: 1
        }, ...users]);
        setUserOffset(userOffset + 1);
      }
    })
  }

  const handleUploadClick = (event) => {
    if (event.target.files && event.target.files[0]) {
      setMedia(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        setSelectedFile(reader.result);
      };
    }
  };

  const onClearImage = () => {
    setSelectedFile("");
    setMedia(null);
  }

  // const getWelcomeMessage = () => {
  //   ApiService.v2().get(`setting`).then(({data}) => {
  //     console.log(data)
  //   });
  // }

  React.useEffect(() => {
    const token = Auth.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({data}) => {
      if(data && data.code === "success"){
        setManagerId(data.data._id);
        setManagerName(data.data.username);
        setManagerImg(data.data.profileImg);
        console.log(data.data);
        // socket initialization
        socket = getSocket();
        socket.emit('admin_init', {
          'id': data.data._id
        });
        queryUser();
      }
    });
  }, []);

  React.useEffect(() => {
    if(socket){
      receiveSocket(socket);    
    }
  }, [users, userId, messagesList]);

  const handleCancel = () => {
    setSettingVisible(false);
  }

  const handleChangeMessage = () => {
    console.log(this.welcomeMessage);
  }

  const handleWelcomeMessageChange = ({target}) => {
    const str = target.value;
    setWelcomeMessage(target.value);
  }

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
                  loadMore={queryUser}
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
                                  badgeContent={ user.unread }
                                  overlap="circle"
                                >
                                  { user.senderImg === "" 
                                    ? <Avatar><Person /></Avatar>
                                    : <Avatar alt = {user.senderName} src = {user.senderImg}/>
                                  }                                  
                                </Badge>
                              </ListItemAvatar>
                              <ListItemText
                                primary={user.senderName ? user.senderName : `${t("User")} ${user.userNo}`}
                                secondary={
                                  <Typography
                                    noWrap={true}
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    { user.message }                                    
                                  </Typography>
                                }
                              />
                              <ListItemSecondaryAction>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="textPrimary"
                                >
                                  { getTimeStr(user.createdAt) }
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
                                  { messageItem.senderImg === "" 
                                    ? <Avatar><Person /></Avatar>
                                    : <Avatar alt = {messageItem.senderName} src = {messageItem.senderImg}/>
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
                                        { messageItem.image && 
                                          <img className={classes.chatImage} src={messageItem.image}/>
                                        }
                                        { messageItem.message}
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
                                        { messageItem.image && 
                                          <img className={classes.chatImage} src={messageItem.image}/>
                                        }
                                        {messageItem.message}
                                      </Typography>
                                    </span>
                                  }
                                />
                                <ListItemAvatar>
                                  <Avatar
                                    className = {classes.chatBoxAvatarRight}
                                    src = {messageItem.senderImg}
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
                  { selectedMedia && 
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
                      <img src={selectedFile} className={classes.sendImage} />
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
                    <Dialog open={settingVisible} onClose={handleCancel} aria-labelledby="form-dialog-title">
                      <DialogTitle id="form-dialog-title">{t('Welcome Message Setting')}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          { t('You can set the welcome message that will appear in the inquiry form of customer service page.') }
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
                          { t('Cancel') }
                        </Button>
                        <Button onClick={handleChangeMessage} color="primary">
                          { t('Save') }
                        </Button>
                      </DialogActions>
                    </Dialog>
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