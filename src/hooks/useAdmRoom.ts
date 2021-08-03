import { useEffect, useState } from "react";

import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useAdmRoom(roomId: any) {
    const [isAuthor, setIsAuthor] = useState(false);
    const { user } = useAuth();

    const authorId = database.ref(`rooms/${roomId}`);
     
    useEffect(() => {
        if(user !== undefined) {
            authorId.orderByChild(`authorId`).on('value', function (snapshot) {
               if(user.id !== snapshot.val().authorId) {
                   console.log("pq foi");
                   setIsAuthor(false);
               } else {
                   console.log("a");
                   setIsAuthor(true);
               }
           });
       }
     },[user?.id]);
    

    return isAuthor;
}