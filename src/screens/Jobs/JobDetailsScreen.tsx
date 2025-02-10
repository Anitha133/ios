import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions

} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/Authcontext';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../New';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import ViewJobDetails from './ViewJobDetails';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { applyJob } from '../../services/Jobs/JobDetails';
import API_BASE_URL from '../../services/API_Service';
const { width,height } = Dimensions.get('window');

type JobDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'JobDetailsScreen'>;
};



const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ route }) => {
  const { job } = route.params;
  const { userToken } = useAuth();
  const [jobStatus, setJobStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'JobDetails'>>();
  useEffect(() => {
    const fetchJobStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/applyjob/recruiters/applyjob-status-history/${job.applyJobId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const body = response.data;
        setLoading(false);

        if (Array.isArray(body) && body.length > 0) {
          const filteredStatuses = body.filter(
            status => !['screening', 'interview', 'selected', 'rejected'].includes(status.status)
          );
          const reversedStatuses = filteredStatuses.reverse();
          setJobStatus(reversedStatuses);
        }
      } catch (error) {
        console.error('Error fetching job status:', error);
        setLoading(false);
      }
    };

    fetchJobStatus();
  }, [job, userToken]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };
  const formatDates = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        ) : (
          <View>
            <View style={styles.jobCard}>
              <View style={styles.row}>
                <Image
                  source={require('../../assests/Images/company.png')}
                  style={styles.companyLogo}
                />
                <View style={styles.jobDetails}>
                  <Text style={styles.jobTitle}>{job.jobTitle}</Text>
                  <Text style={styles.companyName}>{job.companyname}</Text>
                </View>
              </View>

              <View style={[styles.tag, styles.locationContainer]}>
                <Image
                  source={require('../../assests/Images/rat/loc.png')}
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>{job.location}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'nowrap', alignItems: 'center', marginLeft: 10 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                  <Image
                    source={require('../../assests/Images/rat/exp.png')}
                    style={styles.brieficon}
                  />
                  <Text style={styles.ovalText}>
                    Exp: {job.minimumExperience} - {job.maximumExperience} years
                  </Text>
                  <Text style={{ color: '#E2E2E2' }}>  |</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginTop: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ fontSize: 14 }}>₹ </Text>
                    <Text style={styles.ovalText}>{job.minSalary.toFixed(2)} -  {job.maxSalary.toFixed(2)} LPA  </Text>
                    <Text style={{ color: '#E2E2E2' }}>  |</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.ovalText}>{job.employeeType}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.postedOn}>Posted on {formatDate(job.creationDate)}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.statusHeader}>Status History</Text>

              {jobStatus.length > 0 ? (
                <View style={styles.statusTable}>
                  {jobStatus.map((status, index) => (
                    <View key={index} style={styles.statusRow}>
                      <Text style={styles.statusDate}>
                        {formatDates(status.changeDate)}
                      </Text>
                      <View style={styles.iconWrapper}>
                        {status.status === 'Completed' ? (
                          <Icon name="check-circle" size={24} color="#4CAF50" />

                        ) : (
                          <View style={styles.circle} />

                        )}
                        {index < jobStatus.length - 1 && (
                          <View style={styles.verticalLine} />
                        )}
                      </View>
                      <Text style={styles.statusText}>
                        {status.status === 'New' ? 'Job Applied' : status.status}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.placeholderText}>
                  No status history available!
                </Text>
              )}

            </View>
          </View>
        )}
      </ScrollView>
      <View style={{ height: 20 }} />
      {/* Footer outside ScrollView */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            console.log('Navigating to JobDetails with job:', job);
            navigation.navigate('ViewJobDetails', { job });
          }}
        >
          <LinearGradient
            colors={['#F97316', '#FAA729']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, styles.applyButtonGradient]}
          >
            <Text style={styles.viewJobText}>View Job</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'PlusJakartaSans-Medium'
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    paddingHorizontal: 8,
    margin: 2,
    marginBottom: 6,


  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6', // Background color for the oval
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50, // Makes the container oval
    marginBottom: 8,
    marginRight: 3
  },
  ovalText: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  brieficon: {
    height: 10,
    width: 12,
    marginRight: 8,
  },
  briefcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {

    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,

    marginRight: 3,
    marginBottom: 8,
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10
  },
  locationIcon: {
    width: 11,
    height: 12,
    marginRight: 6,

  },
  locationText: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 16,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    color: '#121212', // Text color
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16, // Font size
    fontStyle: 'normal', // Font style
    lineHeight: 16, // Adjust line height as needed
    textTransform: 'capitalize', // Capitalize text
  },
  companyName: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    fontStyle: 'normal',
    fontWeight: 600,
    color: 'rgba(83, 83, 83, 0.80)',
    marginVertical: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    marginBottom: 12,
    marginTop: 6
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postedOn: {
    color: '#979696', // Text color
    fontFamily: 'PlusJakartaSans-Medium', // Custom font
    fontSize: 9, // Font size
    fontStyle: 'normal', // Font style
    lineHeight: 23.76, // Line height (in points, not percentage)
    marginTop: 9,
    display: 'flex',
    marginLeft: '50%'
  },
  statusHeader: {
    fontSize: 16,
    marginBottom: 8,
    color: '#F46F16',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  statusContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginLeft: 2,
    marginBottom: 10,
  },
  statusTable: {
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnHeader: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  statusDate: {
    fontSize: 14,
    color: '#5D5555',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  statusText: {
    fontSize: 14,
    color: '#5D5555',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  iconWrapper: {
    zIndex: 1,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F46F16',
    backgroundColor: '#F46F16',
    marginLeft: -10,
  },
  verticalLine: {
    position: 'absolute',
    top: 16,
    bottom: -40,
    width: 1,
    backgroundColor: '#F46F16',
    left: 7,
  },
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 7, // Adjust padding for better spacing
    paddingHorizontal: 16,
    padding: 13,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',

  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,

  },

  viewJobText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',

    

  },

  applyButtonGradient: {
    borderRadius: 10,
    flex: 1,
    width: '100%',
    height:height*0.075,
    padding: 20,
    alignItems: 'center',
  },


});

export default JobDetailsScreen;

