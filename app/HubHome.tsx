import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { themeSettings } from '../constants/Colors';
import { useRoute, RouteProp } from '@react-navigation/native';
import HubOverviewPage from '@/components/HubOverviewPage';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {  NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; 
import { Hub,Member } from '@/types';
import { Qube } from '@/types';
import HexagonWithText from '@/components/HexagonWithText';
import ZoneScreen from '@/components/zone';
import CreateQubeDialog from '@/dialogs/CreateQubeDialog';
import CreateZoneDialog from '@/dialogs/CreateZoneDialog';
import QubePermissionDialog from '@/dialogs/QubePermissionDialog';
// Define the route parameters type
type HubHomeRouteParams = {
  name?: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
  demonym?: string;
  hubId?: string;
  ownerId?:string[];
  setHubs:()=>void;
};

// Define the type for the route prop
type HubHomeRouteProp = RouteProp<{ HubHome: HubHomeRouteParams }, 'HubHome'>;
type NavigationType = NavigationProp<RootStackParamList>;
type LibraryNavProp = {
  navigate: (screen: string, params?: any) => void;
};
type SettingNavProp={
  navigate:(screen:string, params?:any)=>void;
}
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
  const [owners,setOwners]=useState<Member[]>();
  const [qubes,setQubes]=useState([]);
  const [selectedQube,setselectedQube]=useState<Qube>();
  const [zones,setZones]=useState([]);
  const [selectedZone,setSelectedZone]=useState<any>(null);
  const [qubediag,setqubediag]=useState(false);
  const [zonediag,setzonediag]=useState(false);
  const [wall,setwall]=useState('');
  const {_id}=useSelector((state:any)=>state.auth.user);
  const token=useSelector((state:any)=>state.auth.token);
  const navigationlibrary = useNavigation<LibraryNavProp>();
  const navigationsetting=useNavigation<SettingNavProp>();
  // Use the route hook to get params
  const route = useRoute<HubHomeRouteProp>();
  const { name, description, avatar_url, banner_url, demonym, hubId,ownerId, setHubs } = route.params;
  const [hubname,sethubname]=useState(name);
  const [desc,setdesc]=useState(description);
  const [avatar,setavatar]=useState(avatar_url);
  const [banner,setbanner]=useState(banner_url);
  const [demon,setdemon]=useState(demonym);
  const [qubepermissiondialog,setqubepermissiondialog]=useState(false);
  const [joinqube,setjoinqube]=useState<Qube>();
  const [requests,setrequests]=useState();
  const openpermissiondialog=(qube:Qube)=>{
    setqubepermissiondialog(true);
    setjoinqube(qube);
  }
  const closepermissiondialog=()=>{
    setqubepermissiondialog(false);
    setjoinqube(undefined);
  }
  const drawerwidth=//selectedQube?EXPANDED_DRAWER_WIDTH:
  DRAWER_WIDTH;
  ////(selectedQube);
  useEffect(()=>{
    const fetchMembers=async()=>{
        ////(hubId);
        try {
          const response=await fetch(`https://surf-jtn5.onrender.com/hub/${hubId}/members`,{
            method:"GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data=await response.json();
          ////(data.userDetails);
          setMembers(data.userDetails);
          ////(members);
        } catch (error) {
          
        }
      }
    const getowner=async()=>{
        try {
          if(ownerId)
          {const ownersdet = await Promise.all(
            ownerId.map(async (id) => {
              const response = await fetch(`https://surf-jtn5.onrender.com/users/${id}`, {
                method: "GET",
              });
              const data = await response.json();
              return data; // Return the fetched data for each owner
            })
          );
      
          setOwners(ownersdet); // After all requests are done, set the owners state}
          console.log(ownersdet);
            ////(data);
        }} catch (error) {
            
        }
    }
    const getqubes=async()=>{
      try {
        const response=await fetch(`https://surf-jtn5.onrender.com/hub/${hubId}`,{
          method:"GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data=await response.json();
        //console.log(data);
        // const sortedQubes = data.qubes.sort((a:any, b:any) => {
        //   if (a.access==='true' && b.access==='false') return -1; // a comes first if access is true
        //   if (a.access==='false' && b.access==='true') return 1;  // b comes first if access is true
    
        //   // Both have access false, now check member array for _id inclusion
        //   const aHasMember = a.members.includes(_id);
        //   const bHasMember = b.members.includes(_id);
    
        //   if (aHasMember && !bHasMember) return -1; // a comes first if user is in members array
        //   if (!aHasMember && bHasMember) return 1;  // b comes first if user is in members array
    
        //   // Otherwise keep order as is
        //   return 0;
        // });
        setQubes(data.qubes);
        //console.log(qubes);
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
        //(wall);
        ////(wall);
      } catch (error) {
        
      }
    }
      fetchMembers();
      getowner();
      getqubes();
      getwallpaper();
},[setHubs])

const fetchZones=async(selectedQube:Qube)=>{
  setZones([]);
  ////(selectedQube);
  try {
    const response=await fetch(`https://surf-jtn5.onrender.com/qube/${selectedQube?._id}/zone`,{
      method:"GET",
      headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json" }
    })
    const data=await response.json();
    ////(data);
    setZones(data.zones);

    setSelectedZone(data.zones[0]);
    //setSelectedZone(data.zones[0]);
    //joinZone(data.zones[0]._id);
   
  } catch (error) {
    
  }
}

// const selectQube=(qube:Qube)=>{
//   setselectedQube(qube);
//   ////(qube);
//   ////(selectedQube);
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
  const onsendRequest=async()=>{
    const data={qube:joinqube?._id, user:_id, hub:hubId};
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/qubepermit/sendreq`,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      closepermissiondialog();
    } catch (error) {
      
    }
  }

  
  return (
    <View style={styles.container}>
      {/* Custom Drawer */}
      <Animated.View
        style={[styles.drawer, {width:drawerwidth, transform: pan.getTranslateTransform()
          
         }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.drawercontent}>
        <View style={styles.drawercontainer}>
        <View style={styles.qubesplace}>
        <Text style={styles.heading}>Qubes</Text>
        
       {qubes.map((qube:Qube)=>(<HexagonWithText key={qube._id} qube={qube} onPress={()=>{//setselectedQube(null);
       if(qube.access==='true')
        {setSelectedZone(null);
        fetchZones(qube);setselectedQube(qube);}
        else
        {
          if(qube.members?.includes(_id))
            {setSelectedZone(null);
              fetchZones(qube);setselectedQube(qube);}
          else
          {
            openpermissiondialog(qube);
          }
            
        }
        }} selectedQube={selectedQube} setselectedQube={setselectedQube} />))}
        
        {ownerId?.includes(_id) && (<TouchableOpacity style={[{marginTop:20}]} onPress={()=>setqubediag(true)}>
        <AntDesign name="pluscircleo" size={34} color="white" />
        </TouchableOpacity>)}

       </View>
        </View>
       
       {/* {selectedQube && ( <View style={styles.zonesplace}>
        <View style={[{flexDirection:'row', justifyContent:'space-between'}]}>
        <Text style={styles.heading}>Zones</Text>
        <Text style={[{borderColor:'white', color:'white', fontSize:20, borderWidth:1, borderStyle:'dashed', borderRadius:30,
            paddingHorizontal:15, width:42, textAlign:'center'
          }]} onPress={()=>setzonediag(true)}>+</Text>
          </View>
        {zones?.map((zone:any)=>(
          <TouchableOpacity style={[styles.zone,{backgroundColor:selectedZone?._id===zone._id?'#7D7D7D':'transparent'}]} 
          onPress={()=>{setDrawerOpen(false);setSelectedZone(zone); }} key={zone._id}>
          <Text style={styles.zonename}>{zone.name}</Text>
          </TouchableOpacity>
          ))}
          
        </View>)} */}
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.appBar}>
          {/* Menu Button (left) */}
          <TouchableOpacity onPress={handleDrawerToggle} >
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.gap}>

          </View>
          {/* Open Library Button (center) */}
          <TouchableOpacity onPress={() => {
            const data={hub:hubId, wallpaper:wall, hubname:hubname, setwall:setwall};
            navigationlibrary.navigate("Library",data);
          }} style={styles.libraryButton}>
            <Text style={{ color: 'white' }}>Open Library</Text>
          </TouchableOpacity>

          {/* Settings Icon (right) */}
          <TouchableOpacity onPress={() =>{
            const data={hubname:hubname,sethubname:sethubname,avatar:avatar,setavatar:setavatar,demon:demon,setdemon:setdemon,banner:banner,
              setbanner:setbanner, desc:desc,setdesc:setdesc, hubId:hubId
            };
            navigationsetting.navigate("HubSetting",data);
          }}>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
         {!selectedZone?( <HubOverviewPage name={hubname} description={desc} avatar_url={avatar}
                           banner_url={banner} demonym={demon} members={members} owners={owners} hubId={hubId} ownerId={ownerId} setHubs={setHubs} setowners={setOwners}/>):(
                            <ZoneScreen selectedZone={selectedZone} selectedQube={selectedQube} hubId={hubId} members={members} hubname={name} commkey={selectedZone.symmkey}/>
                           )}
        </View>
        <CreateQubeDialog visible={qubediag} onClose={()=>setqubediag(false)} setQubes={setQubes} hub={hubId} owners={ownerId}/>
        <CreateZoneDialog visible={zonediag} onClose={()=>setzonediag(false)} setZones={setZones} qube={selectedQube}/>
        <QubePermissionDialog visible={qubepermissiondialog} onClose={closepermissiondialog} onsendRequest={onsendRequest}/>
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
    backgroundColor:'transparent',
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
    height:'100%',
    width:90
  },
  zonesplace:{
    paddingTop:20,
    marginLeft:15,
    //width:'58%'
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
