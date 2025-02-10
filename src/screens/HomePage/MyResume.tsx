
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, ScrollView } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAuth } from '../../context/Authcontext';
import API_BASE_URL from '../../services/API_Service';
import { useFocusEffect } from '@react-navigation/native';
import { Callback } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const PDFExample = () => {
  const userid = useAuth();
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchPdf = async () => {
    try {
      setLoading(true);
      console.log('usereid:', userid.userId)
      const response = await fetch(`${API_BASE_URL}/resume/pdf/${userid.userId}`);
      console.log(response)
      const arrayBuffer = await response.arrayBuffer();
      const base64Pdf = arrayBufferToBase64(arrayBuffer);
      const pdfUri = `data:application/pdf;base64,${base64Pdf}`;
      setPdfUri(pdfUri);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      setError('Error fetching PDF');
    }
    finally {
      setLoading(false);
    }

  };

  useFocusEffect(
    useCallback(() => {
      fetchPdf();
    }, [userid.userId])
  );

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const source = { uri: pdfUri };

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <View style={styles.container}>
        <View style={{ height: 50 }}>
          <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 25 }}>My Resume</Text>
        </View>
        {pdfUri ? (
          <View style={{ flex: 1, width: "100%" }}>
          <Pdf
            source={source as { uri: string }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
          </View>
        ) : error ? (
          <ScrollView>
            <Text>{error}</Text>
          </ScrollView>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PDFExample;
