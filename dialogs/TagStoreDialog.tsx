import React, { useEffect, useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, Button, StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ChatItem from '@/components/ChatItem'; // Assuming ChatItem is in the same directory
import { Message } from '@/types';
import { themeSettings } from '../constants/Colors';
interface TagStoreDialogProps {
    open: boolean;
    onClose: () => void;
    qubeid?: string;
  }
  const colors = themeSettings("dark");
const TagStoreDialog:React.FC<TagStoreDialogProps> = ({ open, qubeid, onClose }) => {
  const [tagCountsArray, setTagCountsArray] = useState([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleMessagesCount, setVisibleMessagesCount] = useState(3);


  const _id = 'your-user-id';  // Replace with your actual user ID logic

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await fetch(`https://surf-jtn5.onrender.com/tag/${qubeid}`, {
          method: 'GET',
        });
        const data = await response.json();
        const sortedTags = data.tagCountsArray.sort((a:any, b:any) => b.count - a.count);
        setTagCountsArray(sortedTags);
        //console.log(sortedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    if (open) {
      getTags();
    }
  }, [qubeid, open]);

  const fetchTexts = async (tag:any) => {
    let tagData = { tag: tag };
    try {
      const response = await fetch(`https://surf-jtn5.onrender.com/tag/message/${qubeid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData),
      });
      const datax = await response.json();
      setMessages(datax);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleBackToTags = () => {
    setMessages([]);  // Clear messages to show tags again
    setVisibleMessagesCount(3);  // Reset visible messages count
  };

  const handleLoadMore = () => {
    setVisibleMessagesCount((prevCount) => prevCount + 3);
  };

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="slide"
      onRequestClose={() => { onClose(); setMessages([]); setVisibleMessagesCount(3); }}
    >
        <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.dialogContent, { backgroundColor: '#36393f' }]}>
          {/* Title */}
          <Text style={[styles.dialogTitle, { backgroundColor: colors.colors.primary.main, color: '#f6f6f6' }]}>
            Tag Store
          </Text>

          {/* Content */}
          {messages.length > 0 ? (
            <View>
                <TouchableOpacity >
              <Button title="Back to #" onPress={handleBackToTags} color={colors.colors.primary.main}  />
              </TouchableOpacity>
              <ScrollView style={styles.messagesContainer}>
                {messages.slice(0, visibleMessagesCount).map((message, index) => (
                  <ChatItem key={index} message={message} isOwnMessage={message.sender_id._id === _id} />
                ))}
              </ScrollView>

              {visibleMessagesCount < messages.length && (
                <Button title="Load More" onPress={handleLoadMore} color={colors.colors.primary.main} />
              )}
            </View>
          ) : (
            tagCountsArray.length > 0 ? (
              <ScrollView style={styles.tagContainer}>
                {tagCountsArray.map(({ tag, count }) => (
                  <TouchableOpacity key={tag} onPress={() => fetchTexts(tag)} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <Text style={styles.tagCount}>{count}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyMessageContainer}>
                <Text style={styles.emptyTitle}>This is where you will find tags in this qube</Text>
                <Text style={styles.emptyBody}>Tag your messages using '#' like</Text>
                <View style={styles.tagExample}>
                  <Text style={styles.tagExampleText}>
                    <Text style={{ fontWeight: 'bold', color: '#635acc' }}>#shopping</Text> check this shirt.
                  </Text>
                </View>
              </View>
            )
          )}
          {/* Close Button */}
          {/* <View style={styles.footer}>
            <Button title="Close" onPress={() => { onClose(); setMessages([]); setVisibleMessagesCount(3); }} color={colors.colors.primary.main} />
          </View> */}
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Define the styles to mimic MUI look
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dialogContent: {
    width: '90%',
    borderRadius: 10,
    //padding: 16,
    elevation:6
  },
  dialogTitle: {
    fontSize: 20,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tagContainer: {
    marginVertical: 16,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginBottom: 8,
    marginRight:15,
    marginLeft:15,
    
  },
  tagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:colors.colors.primary.main
  },
  tagCount: {
    fontSize: 14,
    color: '#888',
  },
  messagesContainer: {
    maxHeight: 200,
    marginBottom: 16,
    marginTop:16
  },
  emptyMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'left',
    fontWeight:'bold',
    color:colors.colors.primary.main
  },
  emptyBody: {
    fontSize: 16,
    textAlign: 'left',
    color:'white'
  },
  tagExample: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  tagExampleText: {
    fontSize: 16,
  },
  footer: {
    margin: 16,
    alignItems: 'flex-end',
    
  },
});

export default TagStoreDialog;
