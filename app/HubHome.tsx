import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeSettings } from '../constants/Colors';
import { useRoute, RouteProp } from '@react-navigation/native';
import HubOverviewPage from '@/components/HubOverviewPage';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {  NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; 
import { Member } from '@/types';
import { Qube } from '@/types';
import HexagonWithText from '@/components/HexagonWithText';
import ZoneScreen from '@/components/zone';
// Define the route parameters type
type HubHomeRouteParams = {
  name?: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
  demonym?: string;
  hubId?: string;
  ownerId?:string;
};

// Define the type for the route prop
type HubHomeRouteProp = RouteProp<{ HubHome: HubHomeRouteParams }, 'HubHome'>;
type NavigationType = NavigationProp<RootStackParamList>;
type LibraryNavProp = {
  navigate: (screen: string, params?: any) => void;
};
// Drawer width
const statusBarHeight = StatusBar.currentHeight || 0;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate the drawer height by subtracting the status bar height
const DRAWER_HEIGHT = SCREEN_HEIGHT - statusBarHeight;
const DRAWER_WIDTH = 90;
const EXPANDED_DRAWER_WIDTH = 270;
const colors = themeSettings("dark");

// Main Hub Home Screen
const HubHomeScreen: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pan] = useState(new Animated.ValueXY({ x: -DRAWER_WIDTH, y: 0 }));
  const [members,setMembers]=useState([]);
  const [owner,setOwner]=useState<Member>();
  const [qubes,setQubes]=useState([]);
  const [selectedQube,setselectedQube]=useState<Qube>();
  const [zones,setZones]=useState([]);
  const [selectedZone,setSelectedZone]=useState<any>(null);
  const [wall,setwall]=useState('');
  const {_id}=useSelector((state:any)=>state.auth.user);
  const token=useSelector((state:any)=>state.auth.token);
  const navigationlibrary = useNavigation<LibraryNavProp>();
  // Use the route hook to get params
  const route = useRoute<HubHomeRouteProp>();
  const { name, description, avatar_url, banner_url, demonym, hubId,ownerId } = route.params;
  const drawerwidth=selectedQube?EXPANDED_DRAWER_WIDTH:DRAWER_WIDTH;
  //console.log(selectedQube);
  useEffect(()=>{
    const fetchMembers=async()=>{
        //console.log(hubId);
        try {
          const response=await fetch(`https://surf-jtn5.onrender.com/hub/${hubId}/members`,{
            method:"GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data=await response.json();
          //console.log(data.userDetails);
          setMembers(data.userDetails);
          //console.log(members);
        } catch (error) {
          
        }
      }
    const getowner=async()=>{
        try {
            const response=await fetch(`https://surf-jtn5.onrender.com/users/${ownerId}`,{
                method:"GET"
            });
            const data=await response.json();

            setOwner(data);
            //console.log(data);
        } catch (error) {
            
        }
    }
    const getqubes=async()=>{
      try {
        const response=await fetch(`https://surf-jtn5.onrender.com/hub/${hubId}`,{
          method:"GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data=await response.json();
        setQubes(data.qubes);
        
      } catch (error) {
        
      }
    }
    const getwallpaper=async()=>{
      try {
        const response=await fetch(`https://surf-jtn5.onrender.com/wall/${_id}/${hubId}`,{
          method:"GET"
        });
        const data=await response.json();
        setwall(data[0].wall_url);
        console.log(wall);
        //console.log(wall);
      } catch (error) {
        
      }
    }
      fetchMembers();
      getowner();
      getqubes();
      getwallpaper();
},[])

const fetchZones=async(selectedQube:Qube)=>{
  setZones([]);
  //console.log(selectedQube);
  try {
    const response=await fetch(`https://surf-jtn5.onrender.com/qube/${selectedQube?._id}/zone`,{
      method:"GET",
      headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json" }
    })
    const data=await response.json();
    setZones(data.zones);
    //setSelectedZone(data.zones[0]);
    //joinZone(data.zones[0]._id);
    console.log(zones);
  } catch (error) {
    
  }
}

// const selectQube=(qube:Qube)=>{
//   setselectedQube(qube);
//   //console.log(qube);
//   //console.log(selectedQube);
//   fetchZones();
// }
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    Animated.timing(pan, {
      toValue: { x: -drawerwidth, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleDrawerToggle = () => {
    drawerOpen ? closeDrawer() : openDrawer();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dx > 0 && gestureState.dx < DRAWER_WIDTH) {
        pan.setValue({ x: gestureState.dx - DRAWER_WIDTH, y: 0 });
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > DRAWER_WIDTH / 2) {
        openDrawer();
      } else {
        closeDrawer();
      }
    },
  });

  return (
    <View style={styles.container}>
      {/* Custom Drawer */}
      <Animated.View
        style={[styles.drawer, {width:drawerwidth, transform: pan.getTranslateTransform() }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.drawercontent}>
        <View style={styles.drawercontainer}>
        <View style={styles.qubesplace}>
        <Text style={styles.heading}>Qubes</Text>
        
       {qubes.map((qube:Qube)=>(<HexagonWithText key={qube._id} qube={qube} onPress={()=>{//setselectedQube(null);
        setSelectedZone(null);fetchZones(qube);setselectedQube(qube);}} selectedQube={selectedQube} setselectedQube={setselectedQube}/>))}
       </View>
        </View>
       {selectedQube && ( <View style={styles.zonesplace}>
        <Text style={styles.heading}>Zones</Text>
        {zones?.map((zone:any)=>(
          <TouchableOpacity style={[styles.zone,{backgroundColor:selectedZone?._id===zone._id?'#7D7D7D':'transparent'}]} 
          onPress={()=>{setDrawerOpen(false);setSelectedZone(zone); }} key={zone._id}>
          <Text style={styles.zonename}>{zone.name}</Text>
          </TouchableOpacity>
          ))}
        </View>)}
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.appBar}>
          {/* Menu Button (left) */}
          <TouchableOpacity onPress={handleDrawerToggle} style={styles.gap}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>

          {/* Open Library Button (center) */}
          <TouchableOpacity onPress={() => {
            const data={hub:hubId, wallpaper:wall, hubname:name};
            navigationlibrary.navigate("Library",data);
          }} style={styles.libraryButton}>
            <Text style={{ color: 'white' }}>Open Library</Text>
          </TouchableOpacity>

          {/* Settings Icon (right) */}
          <TouchableOpacity onPress={() => console.log('Go to Settings')}>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
         {!selectedZone?( <HubOverviewPage name={name} description={description} avatar_url={avatar_url}
                           banner_url={banner_url} demonym={demonym} members={members} owner={owner}/>):(
                            <ZoneScreen selectedZone={selectedZone} selectedQube={selectedQube} hubId={hubId}/>
                           )}
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    //width: drawerwidth,
    height: '100%',
    backgroundColor:'#292929',
    position: 'absolute',
    top: statusBarHeight,
    left: 0,
    padding:0,
    margin:0,
    zIndex: 1000,
    borderRadius: 10,
    // Shadow properties
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 15, // Shadow radius
    elevation: 20, // Elevation for Android
    
  },
  drawerCloseButton: {
    alignItems: 'flex-end',
  },
  drawerText: {
    color: 'white',
    fontSize: 18,
  },
  mainContent: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: themeSettings("dark").colors.primary.main,
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 8,
    elevation: 4,
    //top:statusBarHeight,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  libraryButton: {
    backgroundColor: '#4D4599',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gap: {
    flex: 1,
  },
  drawercontent:{
    //justifyContent:'space-evenly',
    flexDirection:'row',
    margin:0,
    padding:0,
    //height:'100%'
  },
  drawercontainer:{
    //justifyContent:'center',
    alignItems:'center',
    margin:0,
   // height:'100%'
    //marginTop:15,
  },
  heading:{
    color:'#f6f6f6',
    fontSize:16
  },
  qubesplace:{
    paddingTop:20,
    margin:0,
    alignItems:'center',
    backgroundColor:colors.colors.primary.main,
    borderRadius:10,
    height:'100%'
  },
  zonesplace:{
    paddingTop:20,
    marginLeft:15,
    width:'58%'
    //alignItems:'center'
  },
  zone:{
    width:'100%',
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    borderRadius:10,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:'transparent'
  },
  zonename:{
    color:'white',
    fontSize:15
  }

});

export default HubHomeScreen;
