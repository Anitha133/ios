import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@context/Authcontext';
import LinearGradient from 'react-native-linear-gradient';
import Resumebanner from '@assests/icons/Resumebanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { requestStoragePermission } from './permissions';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import PDFExam from './resumecomponent';
import { usePdf } from './resumestate';
import { RootStackParamList } from '@models/Model';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResumeBuilder'>;

const { width, height } = Dimensions.get('window');

const PDFExample = () => {
  const userid = useAuth();
  const { pdfUri,refreshPdf } = usePdf();
  const [pdfUri1, setPdfUri1] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  // const fetchPdf = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`${API_BASE_URL}/resume/pdf/${userid.userId}`);
  //     const arrayBuffer = await response.arrayBuffer();
  //     const base64Pdf = arrayBufferToBase64(arrayBuffer);
  //     const pdfUri = `data:application/pdf;base64,${base64Pdf}`;
  //     setPdfUri1(pdfUri);
  //   } catch (error) {
  //     setError('Error fetching PDF');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Helper function to convert ArrayBuffer to Base64
  // const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   for (let i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchPdf();
  //   }, [userid.userId])
  // );

  //Auto-refresh PDF every 10 seconds


  const downloadFile = async () => {
    if (!pdfUri) {
      Toast.show({
        type: 'error',
        text1: '',
        text2: 'No PDF available to download.',
        position: 'bottom',
        visibilityTime: 5000, // Toast stays for 5 seconds
      });
      return;
    }

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Toast.show({
        type: 'error',
        text1: '',
        text2: 'Allow storage permission to download.',
        position: 'bottom',
        visibilityTime: 5000, // Toast stays for 5 seconds
      });
      return;
    }

    const fileName = `Resume_${new Date().getTime()}.pdf`;
    const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      await RNFS.writeFile(downloadPath, pdfUri.replace('data:application/pdf;base64,', ''), 'base64');
      Toast.show({
        type: 'success',
        text1: '',
        text2: `File saved successfully!`,
        position: 'bottom',
        visibilityTime: 5000, // Toast stays for 5 seconds
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '',
        text2: 'Failed to save PDF file.',
        position: 'bottom',
        visibilityTime: 5000, // Toast stays for 5 seconds
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>My Resume</Text>
      </View>
      <View style={styles.container}>
        <LinearGradient
          colors={['#FAA428', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} // 90-degree (horizontal) gradient
          style={styles.gradientContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.resumeText}>Build your professional resume for free.</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ResumeBuilder')}>
              <Text style={styles.buttonText}>Create Now</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Resumebanner width={130} height={130} />
          </View>
        </LinearGradient>
        <View style={styles.pdfContainer}>
          <TouchableOpacity onPress={downloadFile} style={styles.downloadButton}>
            <Image source={require('../../assests/Images/download.png')} style={styles.downloadIcon} />
          </TouchableOpacity>
          <PDFExam />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    marginTop:10,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 10,
    // The default flexDirection is 'column', so items align to the left by default.
  },
  headerText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: 'grey',
    textAlign: 'left',
  },
  pdfContainer: {
    flex: 1,

  },
  pdf: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
  },
  gradientContainer: {
    width: '100%',
    height: height*0.15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'column',
    width: 200,
    justifyContent: 'center',
    marginLeft: 20,
  },
  resumeText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  button: {
    backgroundColor: '#fff',
    width: 93,
    height: 28,
    flexShrink: 0,
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    color: '#F97517',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 58,
    backgroundColor: '#FFF'
  },
  headerImage: {
    width: 20, // Adjust size as needed
    height: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#495057',
    lineHeight: 25,
    marginLeft: 15
  },
  downloadButton: {
    position: 'absolute',
    bottom: 10, // Adjust as needed
    right: 10, // Adjust as needed
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 50,
    marginRight: 1,
  },
  downloadIcon: {
    width: 30,
    height: 30,
  }

});

export default PDFExample;
