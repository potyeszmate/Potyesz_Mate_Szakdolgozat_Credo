// /* eslint-disable no-undef */
// import React from 'react';
// import { View, Text, FlatList, StyleSheet,Image } from 'react-native';
// import { Feather } from '@expo/vector-icons';

// const iconMapping = {
//   twitter: require('../../assets/Recurrings/twitter.png'),
//   youtube: require('../../assets/Recurrings/youtube.png'),
//   linkedIn: require('../../assets/Recurrings/linkedin.png'),
//   wordpress: require('../../assets/Recurrings/wordpress.png'),
//   pinterest: require('../../assets/Recurrings/pinterest.png'),
//   figma: require('../../assets/Recurrings/figma.png'),
//   behance: require('../../assets/Recurrings/behance.png'),
//   apple: require('../../assets/Recurrings/apple.png'),
//   googlePlay: require('../../assets/Recurrings/google-play.png'),
//   google: require('../../assets/Recurrings/google.png'),
//   appStore: require('../../assets/Recurrings/app-store.png'),
//   github: require('../../assets/Recurrings/github.png'),
//   xbox: require('../../assets/Recurrings/xbox.png'),
//   discord: require('../../assets/Recurrings/discord.png'),
//   stripe: require('../../assets/Recurrings/stripe.png'),
//   spotify: require('../../assets/Recurrings/spotify.png'),

// };

// const RecurringTransactionList = ({ recurringTransactions }) => {

//   const capitalizeFirstLetter = (str) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   return (
//     <FlatList
//       data={recurringTransactions}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={({ item }) => (
//         <View style={styles.transactionItem}>
//           <View style={styles.transactionIcon}>
//             <Image source={iconMapping[item.name.toLowerCase()]} style={styles.iconImage} />
//           </View>
//           <View style={styles.transactionInfo}>
//             <Text style={styles.transactionName}>{capitalizeFirstLetter(item.name)}</Text>
//             <Text style={[styles.transactionCategory, { color: '#888' }]}>{capitalizeFirstLetter(item.category)}</Text>
//           </View>
//           <View style={styles.transactionAmount}>
//             <Text style={styles.transactionAmountValue}>${parseInt(item.value)}</Text>
//             <Text style={styles.transactionDate}>
//               {item.Date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//             </Text>
//           </View>
//         </View>
//       )}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   // ... (other styles)
//   transactionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     width: '80%',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//   },
//   transactionIcon: {
//     marginRight: 10,
//   },
//   iconImage: {
//     width: 24,
//     height: 24,
//   },
//   transactionInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   transactionName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   transactionCategory: {
//     fontSize: 16,
//   },
//   transactionAmount: {
//     alignItems: 'flex-end',
//   },
//   transactionAmountValue: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   transactionDate: {
//     color: '#888',
//   },
// });


// export default RecurringTransactionList;
