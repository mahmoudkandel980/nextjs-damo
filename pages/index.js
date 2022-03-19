import { Fragment } from "react";
import Head from "next/head";

import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

const Homepage = (props) => {
    return (
        <Fragment>
            <Head>
                <title>React meetups</title>
                <meta
                    name="description"
                    content="browse ahuge list of highly acrive react meetups"
                />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
};

// export function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS,
//         },
//     };
// }

/*getStaticProps is built in function  help you to wait fetch data
and never render jsx code before render that function*/

export async function getStaticProps() {
    //fetch data from API
    const client = await MongoClient.connect(
        "mongodb+srv://mahmoudkandel980:1y3muy5x9hFHrwRl@cluster0.7ppbc.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map((meetup) => ({
                id: meetup._id.toString(),
                title: meetup.title,
                image: meetup.image,
                address: meetup.address,
            })),
        },
        revalidate: 1,
    };
}

export default Homepage;
