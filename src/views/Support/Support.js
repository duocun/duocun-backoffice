import React from 'react';
import { useTranslation } from "react-i18next";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import FolderIcon from '@material-ui/icons/Folder';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import { ListItemIcon, IconButton, ListItemSecondaryAction, Badge, Paper, Grid, Divider, TextField, TextareaAutosize, InputBase, Typography, Button } from '@material-ui/core';
import { Person, EmojiEmotions, Image } from '@material-ui/icons';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

const useStyles = makeStyles((theme) => ({
  userList: {
    padding: "0 15px !important",
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    height: 'calc(100vh - 250px)',
  },
  chatBox: {
    padding: "0 15px !important",
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    height: 'calc(100vh - 440px)',
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
}));

export default function SupportPage() {

  const { t } = useTranslation();
  const classes = useStyles();

  const [message, setMessage] = React.useState('');
  const [emojiVisible, setEmojiVisible] = React.useState(false);

  return (
    <GridContainer>
      <Card>
        <CardHeader color="primary">
          {t('Support')}
        </CardHeader>
        <CardBody>
          <GridContainer>
            <Grid item className={classes.userList} xs={3}>
              <List>
                <ListItem
                  button
                >
                  <ListItemAvatar>
                    <Badge color="secondary" badgeContent="5" overlap="circle">
                      <Avatar>
                        <Person />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                  <ListItemSecondaryAction>
                    <Typography
                      component="span"
                      variant="caption"
                      color="textPrimary"
                    >
                      12:50 PM
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" />
                <ListItem
                  button
                >
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Work" secondary="Jan 7, 2014" />
                </ListItem>
                <Divider variant="inset" />
                <ListItem
                  button
                >
                  <ListItemAvatar>
                    <Avatar>
                      <BeachAccessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Vacation" secondary="July 20, 2014" />
                </ListItem>
              </List>
            </Grid>
            <GridItem xs={9}>
              <GridContainer>
                <Grid className={classes.chatBox} item xs={12}>
                  <List>
                    <ListItem
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
                              Ali ConnorsAli rsAli Connors :)
                            </Typography>
                          </span>
                        }
                      />
                    </ListItem>
                    <ListItem
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
                              你好
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
                  </List>
                </Grid>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12}>
                  <div
                    style={{
                      position: 'relative',
                    }}
                    onBlur={() => setTimeout(() => setEmojiVisible(false), 100)}
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
                        onSelect={(val) => setMessage(message + val.native)}
                      />
                    )}
                  </div>
                  <InputBase
                    className={classes.chatInputArea}
                    autoFocus
                    multiline
                    rows="5"
                    placeholder={t('Type a message...')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                    >
                      {t('Send')}
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>

        </CardFooter>
      </Card>
    </GridContainer>
  );
}