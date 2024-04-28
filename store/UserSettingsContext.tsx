// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { View, Text } from 'react-native';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebaseConfig';


// interface UserSettingsContextType {
//     userSettings: any;
//     setUserSettings: (settings: any) => void;
// }

// export const UserSettingsContext = createContext<UserSettingsContextType | null>(null);

// interface UserSettingsProviderProps {
//     children: ReactNode;
//     userId: string;  // Assuming you pass userId as a prop to the provider
// }

// export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({ children, userId }) => {
//     const [userSettings, setUserSettings] = useState<any>({});
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchUserSettings = async () => {
//             if (!userId) return;
//             const userRef = doc(db, 'users', userId);
//             const docSnap = await getDoc(userRef);

//             if (docSnap.exists()) {
//                 setUserSettings(docSnap.data() as any);
//             } else {
//                 console.log("No user settings available");
//             }
//             setIsLoading(false);
//         };

//         fetchUserSettings();
//     }, [userId]);

//     if (isLoading) {
//         return <View><Text>Loading...</Text></View>;
//     }

//     return (
//         <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
//             {children}
//         </UserSettingsContext.Provider>
//     );
// };

// export default UserSettingsContext;
