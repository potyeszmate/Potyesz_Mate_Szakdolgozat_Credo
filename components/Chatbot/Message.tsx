import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Message = ({ isUser, text }) => {
    return (
      <View style={[styles.messageRow, isUser ? styles.userMessageRow : styles.chatMessageRow]}>
        <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.chatMessageBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.chatMessageText]}>
            {text}
          </Text>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
    userContainer: {
        alignItems: 'flex-end',
        marginRight: 10,
        marginLeft: 50,
    },
    chatContainer: {
        alignItems: 'flex-start',
        marginLeft: 10,
        marginRight: 50,
    },
    userMessage: {
        color: '#fff',
        backgroundColor: '#35BA52',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    chatMessage: {
        color: '#000',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
     messageRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  chatMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: '70%',
  },
  userMessageBubble: {
    backgroundColor: '#35BA52',
  },
  chatMessageBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  chatMessageText: {
    color: 'black',
  },
});

export default Message;
