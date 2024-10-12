import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
// import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useSelector } from 'react-redux';
import { themeSettings } from '../constants/Colors';
const colors = themeSettings("dark");
interface CreateHubDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  //setHubs: (hubs: any[]) => void;
}

const CreateHubDialog: React.FC<CreateHubDialogProps> = ({ open, onClose, userId }) => {
  const [step, setStep] = useState(1);
  const [hubName, setHubName] = useState('');
  const [hubDescription, setHubDescription] = useState('');
  const [hubAvatar, setHubAvatar] = useState<string | null>('');
  const [hubAvatarDB, setHubAvatarDB] = useState<File | null>(null);
  const [started, setStarted] = useState(false);
  const [datax,setdatax]=useState('');
  const token = useSelector((state: any) => state.auth.token);
  
  const selectImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        
        base64:true
      });
      let photo ;
      if(result?.assets)
        {setHubAvatar(result.assets[0].uri); 
          // const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          //   encoding: FileSystem.EncodingType.Base64,
          // });
      
          const data=`data:image/jpeg;base64,${result.assets[0].base64}`
          console.log(result.assets[0].uri);
          console.log(result.assets[0].type);
          console.log(result.assets[0].fileName);
          photo = { uri: result.assets[0].uri, type: result.assets[0].type, fileName:result.assets[0].fileName }
          //formData.append("filedata",data)
          setdatax(data);
          console.log(data);
        }
      //console.log(result);
  
  };

  const handleNext = () => {
    if (step === 1 && hubName) {
      setStep(2);
    } else if (step === 2 && hubDescription) {
      setStep(3);
    } else if (step === 3 && hubAvatar) {
      setStep(4);
    }
  };

  const handleSkip = () => {
    setHubAvatar(null);
    setStep(4);
  };

  const handleStart = async () => {
    const formData = new FormData();
    setStarted(true);
    if(hubAvatar){
      
    }
    formData.append('name', hubName);
    formData.append('description', hubDescription);

    
    formData.append("filedata",datax);
    formData.append('owner_id', userId);

    const savedHubRes = await fetch('https://surf-jtn5.onrender.com/hub', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, "Content-Type":"multipart/form-data" },
      body: formData,
    });
    const savedHub = await savedHubRes.json();
    setStarted(false);
    if (savedHub) {
      console.log(savedHub);
      onClose();
    }
  };

  return (
    <Modal visible={open} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Starting Hub</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => {
                setHubName('');
                setHubAvatar(null);
                setHubAvatarDB(null);
                setHubDescription('');
                onClose();
              }}
            />
          </View>

          <View style={styles.content}>
            {step === 1 && (
              <View style={styles.step}>
                <Text style={styles.stepTitle}>Step 1: Hub Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hub Name"
                  value={hubName}
                  onChangeText={setHubName}
                />
                <Text style={styles.helperText}>Give your Hub a name</Text>
              </View>
            )}
            {step === 2 && (
              <View style={styles.step}>
                <Text style={styles.stepTitle}>Step 2: Hub Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hub Description"
                  multiline
                  numberOfLines={4}
                  value={hubDescription}
                  onChangeText={setHubDescription}
                />
                <Text style={styles.helperText}>Give it a description to set the stage</Text>
              </View>
            )}
            {step === 3 && (
              <View style={styles.step}>
                <Text style={styles.stepTitle}>Step 3: Hub Avatar</Text>
                <TouchableOpacity style={styles.dropzone} onPress={selectImage}>
                  {hubAvatar ? (
                    <Image source={{ uri: hubAvatar }} style={styles.avatarImage} />
                  ) : (
                    <Text style={[{color:'white'}]}>Click to select your Hub's first impression</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip this step</Text>
                </TouchableOpacity>
              </View>
            )}
            {step === 4 && (
              <View style={[styles.step, {alignItems:'center'}]}>
                {hubAvatar && (
                  <Avatar.Image source={{ uri: hubAvatar }} size={100} style={styles.avatarPreview} />
                )}
                <Text style={styles.hubName}>{hubName}</Text>
                <Text style={styles.hubDesc}>{hubDescription}</Text>
                {started && <ActivityIndicator size="large" color="#0000ff" />}
              </View>
            )}
          </View>

          <View style={styles.actions}>
            {step > 1 && <Button color={colors.colors.primary.main} title="Back" onPress={() => setStep(step - 1)} />}
            {step < 4 && <Button color={colors.colors.primary.main} title="Next" onPress={handleNext} />}
            {step === 4 && (
              <Button color={colors.colors.primary.main} title="Start" onPress={handleStart} disabled={started} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    
  },
  dialog: {
    width: '90%',
    backgroundColor: colors.colors.background.default,
    borderRadius: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white'
  },
  content: {
    marginVertical: 16,
  },
  step: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'white'
  },
  input: {
    borderWidth: 1,
    borderColor: colors.colors.primary.main,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    color:'white'
  },
  helperText: {
    fontSize: 12,
    color: '#666',
  },
  dropzone: {
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  skipText: {
    color: '#007bff',
    textAlign: 'center',
  },
  avatarPreview: {
    marginBottom: 16,
    
  },
  hubName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color:'white'
  },
  hubDesc:{
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color:'white'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons:{

  }
});

export default CreateHubDialog;
