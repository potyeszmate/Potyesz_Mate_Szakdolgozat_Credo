import { StyleSheet } from "react-native";

export const chatbotStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    conversationContainer: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 10,
        marginTop: 5
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingBottom: 8,
      },
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
    inputDisabled: {
      backgroundColor: '#f0f0f0', 
      color: '#999', 
    },
    sendButton: {
        height: 40, 
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#35BA52',
        justifyContent: 'center', 
        paddingHorizontal: 12,
        marginBottom: 6
      },
      sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      topicContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        marginBottom: 3,

      },
      topicButton: {
        backgroundColor: '#4CAF50', 
        paddingVertical: 8, 
        paddingHorizontal: 7,
        height: 40,
        margin: 4, 
        borderRadius: 10, 
        flexBasis: '30%', 
        justifyContent: 'center', 
        alignItems: 'center', 
      },
      topicText: {
        color: '#fff', 
        fontSize: 14, 
      },
});