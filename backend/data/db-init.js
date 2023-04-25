const {db} = require("../config/firebase");
const {collection, getDocs, deleteDoc, Timestamp, doc, setDoc} = require("firebase/firestore");
const {SportType} = require("./type");

const reset = async () => {
    // const userRef = collection(db, "user");
    // const querySnapshot = await getDocs(userRef);
    // querySnapshot.forEach((doc) => {
    //     deleteDoc(doc.ref)
    // });
    const courtRef = collection(db, "court");
    const courtSnapshot = await getDocs(courtRef);
    courtSnapshot.forEach((doc) => {
        deleteDoc(doc.ref)
    });
}

const initialize = async () => {
    const usersRef = collection(db, "user");
    const users = [{
        userID: 1,
        username: "admin",
        password: "adminpass",
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
    }];

    for (const user of users) {
        const docRef = doc(usersRef, user.userID.toString());
        await setDoc(docRef, user).catch((error) => console.log(error))
    }
    console.log("Users added");

    const courtsRef = collection(db, "court");
    const courtsSnapshot = await getDocs(courtsRef);
    if (courtsSnapshot.empty) {
        const courts = [{
            courtID: 1,
            name: "Ottawa Sport",
            description: "Ottawa Sport is a dynamic and thriving sports facility in the National Capital Region, offering top-notch amenities and programs to foster a love of sport and an active lifestyle.",
            address: "1370 Clyde Ave., Nepean, ON K2G 3H8",
            location: {lat: 45.35980969237094, lng: -75.73952064100716},
            sportType: SportType.FOOTBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 4, username: ""}, {
                rating: 4, username: ""
            }, {rating: 5, username: ""}, {rating: 3, username: ""}],
            hours: {
                monday: {open: "12:30", close: "19:00"},
                tuesday: {open: "12:30", close: "19:00"},
                wednesday: {open: "12:30", close: "19:00"},
                thursday: {open: "12:30", close: "19:00"},
                friday: {open: "12:30", close: "19:00"},
                saturday: {open: "00:00", close: "00:00"},
                sunday: {open: "00:00", close: "00:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 30,
                start: "12:30",
                end: "14:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 30,
                start: "14:30",
                end: "16:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 3,
                reservations: 0,
                capacity: 30,
                start: "16:30",
                end: "19:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 2,
            name: "Ottawa Business Park",
            description: "The Ottawa Business Park is a non-profit organization established in 1974 to promote and develop soccer in communities across the National Capital Region. With over 300 adult teams from 55 soccer clubs, the league offers a safe and enjoyable environment to play soccer, aiding in the development of team skills and contributing to a healthy lifestyle. The league has produced members of national teams and has supported students in earning athletic scholarships while pursuing post-secondary education. The league is managed by a volunteer board, responsible for ensuring fairness, accountability, and efficiency to its member clubs, with a zero-tolerance policy for discrimination, harassment, and violence. The league adheres to the rules and regulations of the Eastern Ontario District Soccer Association, Ontario Soccer, and Canadian Soccer.",
            address: "Thurston Dr, Ottawa, ON K1G 4J7",
            location: {lat: 45.38419544257543, lng: -75.61688676990033},
            sportType: SportType.FOOTBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 4, username: ""}, {
                rating: 4, username: ""
            }, {rating: 5, username: ""}, {rating: 3, username: ""}],
            hours: {
                monday: {open: "12:30", close: "19:00"},
                tuesday: {open: "12:30", close: "19:00"},
                wednesday: {open: "12:30", close: "19:00"},
                thursday: {open: "12:30", close: "19:00"},
                friday: {open: "12:30", close: "19:00"},
                saturday: {open: "00:00", close: "00:00"},
                sunday: {open: "00:00", close: "00:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 30,
                start: "12:30",
                end: "14:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 30,
                start: "14:30",
                end: "16:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 3,
                reservations: 0,
                capacity: 30,
                start: "16:30",
                end: "19:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 3,
            name: "Corkstown soccer field #1 & #2",
            description: "Corkstown soccer fields #1 and #2 are two well-maintained football pitches located in the Corkstown area of Ottawa, Canada. The fields are part of the larger Corkstown Road Park, a green space that features various sports facilities, playgrounds, and picnic areas. The soccer fields are designed to accommodate both adult and youth players and are available for organized league play, pick-up games, and training sessions.\n" + "\n" + "Both fields feature high-quality natural grass surfaces, with field #1 being slightly larger than field #2. The fields are surrounded by a sturdy chain-link fence and have bleachers for spectators to watch the games. Additionally, there are designated parking areas for players and visitors.\n" + "\n" + "The soccer fields are maintained by the City of Ottawa and are subject to seasonal closures during the winter months. The fields are popular with local soccer enthusiasts and are often bustling with activity during the warmer months. Overall, Corkstown soccer fields #1 and #2 provide an excellent location for players of all skill levels to enjoy the beautiful game in a picturesque setting.",
            address: "198 Corkstown Rd, Ottawa, ON",
            location: {lat: 45.34238164628727, lng: -75.83389573896861},
            sportType: SportType.FOOTBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 4, username: ""}, {
                rating: 4, username: ""
            }, {rating: 5, username: ""}, {rating: 3, username: ""}],
            hours: {
                monday: {open: "12:30", close: "19:00"},
                tuesday: {open: "12:30", close: "19:00"},
                wednesday: {open: "12:30", close: "19:00"},
                thursday: {open: "12:30", close: "19:00"},
                friday: {open: "12:30", close: "19:00"},
                saturday: {open: "00:00", close: "00:00"},
                sunday: {open: "00:00", close: "00:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 30,
                start: "12:30",
                end: "14:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 30,
                start: "14:30",
                end: "16:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 3,
                reservations: 0,
                capacity: 30,
                start: "16:30",
                end: "19:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 4,
            name: "Union Basketball Court",
            description: "The Union Basketball Court is a highly rated outdoor court located in one of Ottawa's most beautiful neighborhoods, surrounded by trees and with stunning views of the Rideau River. The court boasts excellent playing conditions with clean asphalt and well-maintained hoops. The fenced area is open day and night, with lights allowing for night games. Players praise the quality of competition and the friendly atmosphere with always someone to play with. Although it can be crowded at times, it's still considered one of the best basketball courts in Canada. After a game, players can take a relaxing walk and enjoy the beautiful scenery of the surrounding area. Overall, the Union Basketball Court is an excellent place to play ball and enjoy the natural beauty of Ottawa.",
            address: "Rockcliffe Park, Ottawa, ON",
            location: {lat: 45.437315588178365, lng: -75.6928709576648},
            sportType: SportType.BASKETBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5, username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5, username: ""
            }],
            hours: {
                monday: {open: "00:00", close: "23:59"},
                tuesday: {open: "00:00", close: "23:59"},
                wednesday: {open: "00:00", close: "23:59"},
                thursday: {open: "00:00", close: "23:59"},
                friday: {open: "00:00", close: "23:59"},
                saturday: {open: "00:00", close: "23:59"},
                sunday: {open: "00:00", close: "23:59"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 15,
                start: "00:00",
                end: "23:59",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 5,
            name: "Coronation Park Basketball Court",
            description: "Coronation Park Basketball Court is a part of a lovely little park located near the Trainyards shopping centre. The park provides great equipment for kids, including swings and paths through the woods for little ones to explore. For bigger kids and adults, the basketball court features two nets, making it a great spot to play basketball. However, some players have noted that the nets are in need of repair, with broken and damaged nets, and there may be some rough patches on the court. Overall, the park is a picturesque spot to spend time with family and friends, and the basketball court can be enjoyed by those looking to play a casual game.",
            address: "442 Coronation Ave., Ottawa, ON K1G 0Y9N",
            location: {lat: 45.41010334520298, lng: -75.65237336689907},
            sportType: SportType.BASKETBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5, username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5, username: ""
            }],
            hours: {
                monday: {open: "00:00", close: "23:59"},
                tuesday: {open: "00:00", close: "23:59"},
                wednesday: {open: "00:00", close: "23:59"},
                thursday: {open: "00:00", close: "23:59"},
                friday: {open: "00:00", close: "23:59"},
                saturday: {open: "00:00", close: "23:59"},
                sunday: {open: "00:00", close: "23:59"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 15,
                start: "10:00",
                end: "12:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 15,
                start: "15:00",
                end: "17:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 6,
            name: "Fisher Courts",
            description: "Fisher Courts is a basketball court located in a bustling urban area. The court features modern and well-maintained equipment, including sturdy rims with new nets. Players can expect a smooth playing surface, perfect for a casual pick-up game with friends or an intense practice session. The court is easily accessible and has ample parking available nearby. Whether you're a seasoned baller or a beginner looking to improve your skills, Fisher Courts is a great place to shoot some hoops and have some fun.",
            address: "250 Holland Ave, Ottawa, ON K1Y 0Y5",
            location: {lat: 45.39585067310352, lng: -75.73015543397538},
            sportType: SportType.BASKETBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5, username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5, username: ""
            }],
            hours: {
                monday: {open: "00:00", close: "23:59"},
                tuesday: {open: "00:00", close: "23:59"},
                wednesday: {open: "00:00", close: "23:59"},
                thursday: {open: "00:00", close: "23:59"},
                friday: {open: "00:00", close: "23:59"},
                saturday: {open: "00:00", close: "23:59"},
                sunday: {open: "00:00", close: "23:59"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 15,
                start: "10:00",
                end: "12:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 15,
                start: "15:00",
                end: "17:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 7,
            name: "Rockcliffe Lawn Tennis Club",
            description: "The Rockcliffe Lawn Tennis Club is a seasonal tennis club nestled in the heart of Rockcliffe Park in Ottawa. The club offers an array of tennis programs and memberships for both adults and juniors, including beginner to advanced adult clinics, pre-competitive and recreational junior programs, and exciting summer camps. The club also features two outdoor tennis courts, available for use by members from 8am to 8pm daily. With a focus on community and an excellent team of coaches, the Rockcliffe Lawn Tennis Club is the perfect place to hone your tennis skills, meet new people, and enjoy the great outdoors. Plus, thanks to their generous sponsors, members can enjoy the best tennis experience possible. Don't miss out on the chance to be part of this amazing club - sign up for a membership today!",
            address: "465 Lansdowne Rd N, Rockcliffe Park, ON K1M 0Y1",
            location: {lat: 45.45258575213161, lng: -75.67260024346584},
            sportType: SportType.TENNIS,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 4, username: ""}, {rating: 5, username: ""}],
            hours: {
                monday: {open: "08:00", close: "20:00"},
                tuesday: {open: "08:00", close: "20:00"},
                wednesday: {open: "08:00", close: "20:00"},
                thursday: {open: "08:00", close: "20:00"},
                friday: {open: "08:00", close: "20:00"},
                saturday: {open: "08:00", close: "20:00"},
                sunday: {open: "08:00", close: "20:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 4,
                start: "08:00",
                end: "10:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 4,
                start: "10:00",
                end: "12:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 3,
                reservations: 0,
                capacity: 4,
                start: "12:00",
                end: "14:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 4,
                reservations: 0,
                capacity: 4,
                start: "14:00",
                end: "16:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 5,
                reservations: 0,
                capacity: 4,
                start: "16:00",
                end: "18:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }],
        }, {
            courtID: 8,
            name: "McKellar Park Tennis Courts",
            description: "McKellar Park Tennis Courts is a lovely public park in the heart of Ottawa. The tennis courts are well-maintained, and players of all ages and skill levels can enjoy a game. The park is also home to a soccer field and play structures for kids. While there are a few cracks on the court, overall, the condition is relatively good. However, there are no lights for playing at night, which may be a downside for some players. Nonetheless, the park offers a fantastic experience for tennis doubles, making it an ideal spot for an afternoon game.",
            address: "539 Wavell Ave, Ottawa, ON K2A",
            location: {lat: 45.38290871406877, lng: -75.76601326079455},
            sportType: SportType.TENNIS,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 4, username: ""}, {rating: 5, username: ""}],
            hours: {
                monday: {open: "08:00", close: "20:00"},
                tuesday: {open: "08:00", close: "20:00"},
                wednesday: {open: "08:00", close: "20:00"},
                thursday: {open: "08:00", close: "20:00"},
                friday: {open: "08:00", close: "20:00"},
                saturday: {open: "08:00", close: "20:00"},
                sunday: {open: "08:00", close: "20:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 4,
                start: "10:00",
                end: "12:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 4,
                start: "16:00",
                end: "18:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }],
        }, {
            courtID: 9,
            name: "RCGT Park",
            description: "RCGT Park, located in Ottawa, Canada, is a great place to enjoy an affordable evening of baseball with family and friends. The stadium is clean and well-kept, with plenty of seating and no bad views. The family-friendly atmosphere is perfect for children, with Little League Night allowing kids to go on the field for the anthems and see themselves on the big screen. The ladies' night diamond dig adds a fun and unique experience to the ballgame. However, some reviewers have noted a lack of coolers for non-beer drinkers, which limits drink options.",
            address: "302 Coventry Rd, Ottawa, ON K1K 4P5",
            location: {lat: 45.4198495106144, lng: -75.65390579550754},
            sportType: SportType.BASEBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 4, username: ""}, {rating: 5, username: ""}],
            hours: {
                monday: {open: "08:00", close: "20:00"},
                tuesday: {open: "08:00", close: "20:00"},
                wednesday: {open: "08:00", close: "20:00"},
                thursday: {open: "08:00", close: "20:00"},
                friday: {open: "08:00", close: "20:00"},
                saturday: {open: "08:00", close: "20:00"},
                sunday: {open: "08:00", close: "20:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 4,
                start: "16:00",
                end: "18:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }],
        }, {
            courtID: 10,
            name: "Baseball Canada",
            description: "Baseball Canada is the governing body for baseball in Canada and has been proudly serving the baseball community since 1964. It comprises 10 provincial associations, representing players, coaches, and umpires across the country. Baseball Canada is committed to the growth and development of baseball in Canada and is a member of both the Canadian Olympic Committee and the World Baseball Softball Confederation. It receives funding from Sport Canada and Canadian Heritage, and has been granted charitable status by Revenue Canada. With a strong focus on promoting excellence and sportsmanship, Baseball Canada is dedicated to advancing the sport of baseball in Canada and providing opportunities for players of all ages and levels to develop their skills and achieve their dreams.",
            address: "2212 Gladwin Crescent, Ottawa, ON K1B 5N1",
            location: {lat: 45.40656335225702, lng: -75.62435574785123},
            sportType: SportType.BASEBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 4, username: ""}, {rating: 5, username: ""}],
            hours: {
                monday: {open: "08:00", close: "20:00"},
                tuesday: {open: "08:00", close: "20:00"},
                wednesday: {open: "08:00", close: "20:00"},
                thursday: {open: "08:00", close: "20:00"},
                friday: {open: "08:00", close: "20:00"},
                saturday: {open: "08:00", close: "20:00"},
                sunday: {open: "08:00", close: "20:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 4,
                start: "16:00",
                end: "18:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }],
        }, {
            courtID: 11,
            name: "Ron Milks Field",
            description: "Ron Milks Field is a well-maintained baseball diamond located in the heart of Ottawa, with lush green grass and well-manicured bases. The stadium features comfortable seating for spectators, a state-of-the-art scoreboard, and bright lights for night games. The surrounding trees offer a picturesque backdrop, making it a perfect setting for a relaxing day of baseball.",
            address: "672 Hastings Ave, Ottawa, ON K1G 1N5",
            location: {lat: 45.400599948686946, lng: -75.63997116762202},
            sportType: SportType.BASEBALL,
            reviews: [{rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                rating: 5,
                username: ""
            }, {rating: 4, username: ""}, {rating: 5, username: ""}],
            hours: {
                monday: {open: "08:00", close: "20:00"},
                tuesday: {open: "08:00", close: "20:00"},
                wednesday: {open: "08:00", close: "20:00"},
                thursday: {open: "08:00", close: "20:00"},
                friday: {open: "08:00", close: "20:00"},
                saturday: {open: "08:00", close: "20:00"},
                sunday: {open: "08:00", close: "20:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 4,
                start: "16:00",
                end: "18:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }],
        }, {
            courtID: 12,
            name: "Conroy Field",
            description: "Conroy Field is a basic football field located in Ottawa. While there are no amenities on the field, the grass is well-maintained and perfect for a game of football. Reviews mention that the field is a great spot for football enthusiasts looking for a casual game. One recent reviewer even mentioned their excitement for the field, while another noted that the field is perfect for soccer games.",
            address: "3039-3057 Conroy Rd, Ottawa, ON K1G 6C9",
            location: {lat: 45.37941141291843, lng: -75.62649504761497},
            sportType: SportType.FOOTBALL,
            reviews: [{rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 5, username: ""}, {
                rating: 3,
                username: ""
            }],
            hours: {
                monday: {open: "12:30", close: "19:00"},
                tuesday: {open: "12:30", close: "19:00"},
                wednesday: {open: "12:30", close: "19:00"},
                thursday: {open: "12:30", close: "19:00"},
                friday: {open: "12:30", close: "19:00"},
                saturday: {open: "00:00", close: "00:00"},
                sunday: {open: "00:00", close: "00:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 30,
                start: "12:30",
                end: "14:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 30,
                start: "14:30",
                end: "16:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 3,
                reservations: 0,
                capacity: 30,
                start: "16:30",
                end: "19:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 13,
            name: "Britannia Park Soccer Field",
            description: "Britannia Park Soccer Field is a great place to play football, with a well-maintained field and a refreshing breeze coming from the nearby water. While there are plenty of trails and playgrounds nearby, evening games can be a bit of a challenge due to the mosquito problem. However, if you're willing to brave the bugs or play during the day, this field is definitely worth checking out.",
            address: "98 Farrow St, Ottawa, ON K2B 8J8",
            location: {lat: 45.36189316485721, lng: -75.799991333101},
            sportType: SportType.FOOTBALL,
            reviews: [{rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 5, username: ""}, {
                rating: 3,
                username: ""
            }, {rating: 5, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}],
            hours: {
                monday: {open: "12:30", close: "19:00"},
                tuesday: {open: "12:30", close: "19:00"},
                wednesday: {open: "12:30", close: "19:00"},
                thursday: {open: "12:30", close: "19:00"},
                friday: {open: "12:30", close: "19:00"},
                saturday: {open: "00:00", close: "00:00"},
                sunday: {open: "00:00", close: "00:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 30,
                start: "12:30",
                end: "14:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 30,
                start: "14:30",
                end: "16:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 3,
                reservations: 0,
                capacity: 30,
                start: "16:30",
                end: "19:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }, {
            courtID: 14,
            name: "Lytle Park Soccer Field East",
            description: "Lytle Park Soccer Field East is a hidden gem tucked away in the woods, offering well-maintained facilities and ample space for various sports activities. The large area comprises soccer, baseball and softball fields, as well as a nice play area for kids. Visitors can also enjoy several walking trails, which provide a great opportunity to explore the beautiful surroundings. The park is equipped with a porta potty near the parking lot for convenience. Many reviewers have praised the park's natural beauty and tranquility, making it a favorite spot for locals. Overall, Lytle Park Soccer Field East is a beautiful and versatile park that offers something for everyone.",
            address: "4401 O'Keefe Ct, Nepean, ON K2R 0A2",
            location: {lat: 45.277258391114216, lng: -75.79386094056294},
            sportType: SportType.FOOTBALL,
            reviews: [{rating: 5, username: ""}, {rating: 4, username: ""}, {rating: 5, username: ""}
                , {rating: 3, username: ""}, {rating: 5, username: ""}, {rating: 5, username: ""}, {
                    rating: 5,
                    username: ""
                }, {rating: 4, username: ""}, {rating: 4, username: ""}, {rating: 4, username: ""}, {
                    rating: 1,
                    username: ""
                }],
            hours: {
                monday: {open: "12:30", close: "19:00"},
                tuesday: {open: "12:30", close: "19:00"},
                wednesday: {open: "12:30", close: "19:00"},
                thursday: {open: "12:30", close: "19:00"},
                friday: {open: "12:30", close: "19:00"},
                saturday: {open: "00:00", close: "00:00"},
                sunday: {open: "00:00", close: "00:00"},
            },
            spots: [{
                spotID: 1,
                reservations: 0,
                capacity: 30,
                start: "12:30",
                end: "14:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 2,
                reservations: 0,
                capacity: 30,
                start: "14:30",
                end: "16:30",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            }, {
                spotID: 3,
                reservations: 0,
                capacity: 30,
                start: "16:30",
                end: "19:00",
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date())
            },],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        },];

        for (const court of courts) {
            const docRef = doc(courtsRef, court.courtID.toString());
            await setDoc(docRef, court).catch((error) => console.log(error))
        }
        console.log("Courts added");
    }
}


module.exports = {reset, initialize};
