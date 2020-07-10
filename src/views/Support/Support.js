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
  Image,
} from '@material-ui/icons';

import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import InfiniteScroll from 'react-infinite-scroller'

import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

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
}));

export default function SupportPage() {

  const { t } = useTranslation();
  const classes = useStyles();

  const chatBoxRef = React.useRef(null);
  const chatInputRef = React.useRef(null);

  const [message, setMessage] = React.useState('');
  const [emojiVisible, setEmojiVisible] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [messages, setMessages] = React.useState([]);

  const initUsers = [
    {
      name: 'test1',
      avatar: '',
      recent_message: 'hellohellohellohellohellohellohello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10)
    },
    {
      name: 'test2',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test3',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test4',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test5',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test6',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test7',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test8',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test9',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
    {
      name: 'test10',
      avatar: '',
      recent_message: 'hello',
      recent_datetime: '12:30',
      unread_count: Math.floor(Math.random() * 10),
    },
  ];

  const initMessages = [
    {
      content: 'Hi, everybody! 1',
      role: 'customer',
      datetime: '13:24'
    },
    {
      content: 'Hi, everybody!',
      role: 'supporter',
      datetime: '13:24'
    },
    {
      content: 'Hi, everybody!',
      role: 'customer',
      datetime: '13:24'
    },
    {
      content: 'Hi, everybody!',
      role: 'supporter',
      datetime: '13:24'
    },
    {
      content: 'Hi, everybody!',
      role: 'customer',
      datetime: '13:24'
    },
  ];

  const queryUser = () => {
    setUsers(users.concat(initUsers));
  };

  const queryMessage = () => {
    setMessages(messages.concat(initMessages));
  };

  const handleSubmit = () => {
    if (message.trim() === '') {
      setMessage('');
    } else {
      setMessages([...messages, {
        content: message,
        role: 'supporter',
        datetime: 'now',
      }]);
      setMessage('');
      setTimeout(() => {
        chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }, 200);
    }
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
                  loadMore={queryUser}
                  hasMore={true}
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
                            >
                              <ListItemAvatar>
                                <Badge
                                  color="secondary"
                                  badgeContent={user.unread_count}
                                  overlap="circle"
                                >
                                  <Avatar>
                                    <Person />
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>
                              <ListItemText
                                primary={user.name}
                                secondary={
                                  <Typography
                                    noWrap={true}
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    {user.recent_message}
                                  </Typography>
                                }
                              />
                              <ListItemSecondaryAction>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="textPrimary"
                                >
                                  {user.recent_datetime}
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
                      hasMore={true}
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
                        {messages.map((message, index) => {
                          if (message.role === 'customer') {
                            return (
                              <ListItem
                                key={`message-${index}`}
                                alignItems="flex-start"
                              >
                                <ListItemAvatar>
                                  <Avatar>
                                    <Person />
                                  </Avatar>
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
                                        {message.content}
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
                                        {message.content}
                                      </Typography>
                                    </span>
                                  }
                                />
                                <ListItemAvatar>
                                  <Avatar
                                    className={classes.chatBoxAvatarRight}
                                  >
                                    <Person />
                                  </Avatar>
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
                    <IconButton
                      color="primary"
                      aria-label="image"
                      component="span"
                    >
                      <Image />
                    </IconButton>
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