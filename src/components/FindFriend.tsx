/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery,gql, useQuery, useMutation } from "@apollo/client"
import FriendHTMLForm from "./FriendHTMLForm";
import { IFriend } from "../interfaces/IFriend";


const EDIT_FRIEND = gql`
mutation 
editFriend($email: String,$friend : FriendEditInput){
  editFriend(email: $email,input:$friend){
   firstName
    lastName
    email
    role
    id
  }
}`

const GET_FRIEND = gql`
  query getFriendByEmail($email:String!){
  getFriendByEmail(email:$email){
    id
    email
    firstName
    lastName
    role  
    }
}
`

const ALL_FRIENDS = gql`
{
  getAllFriends{
    id
    firstName
    lastName
    email
    role
  }
}
`

interface IKeyableFriend extends IFriend {
  [key: string]: any
}

export default function FindFriend() {
  const [email, setEmail] = useState("")
  const [getFriendByEmail, { loading, error, data: findFriendData }] = useLazyQuery(GET_FRIEND, {variables: {email}});
  const EMPTY_FRIEND: IFriend = { id: "",firstName: "", lastName: "", password: "", email: "", role: "" }
  const [friend, setFriend] = useState({ ...EMPTY_FRIEND })
    
  const [editFriend, { data: editData }] = useMutation(
    EDIT_FRIEND,
    {
      update(cache, { data }) {
        const changedFriend = data.editFriend;
        const d: any = cache.readQuery({ query: ALL_FRIENDS })
        let allFriends = d.getAllFriends || []
        cache.writeQuery({ query: ALL_FRIENDS, data: { getAllFriends: [...allFriends, changedFriend] } })
      }
    })

   const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const id = event.currentTarget.id;
    var friendToEdit: IKeyableFriend = { ...friend };
    friendToEdit[id] = event.currentTarget.value;
    setFriend({ ...friendToEdit })
  }

  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const {id, ...fields } = friend;
    editFriend({
      variables: {
        email: findFriendData.getFriendByEmail.email,
        friend: fields
      }
    })
    setFriend({ ...EMPTY_FRIEND })
  }

  const fetchFriend = () => {
     getFriendByEmail();
  }

  if(findFriendData?.getFriendByEmail && findFriendData.getFriendByEmail !== friend && friend.id === ''){
    const {__typename, ...rest} = findFriendData.getFriendByEmail;
     setFriend(rest);
  }

  return (
    <div>
    <div>
    <h2>Fetch a friend using their email</h2>
      Email:<input type="txt" value={email} onChange={e => { setEmail(e.target.value) }} />
      &nbsp; <button onClick={() => fetchFriend()}>Find Friend</button>
      <br/>
      <br/>
    </div>
    
    {findFriendData && 
    <div>
    <FriendHTMLForm handleSubmit={handleSubmit} handleChange={handleChange} friend={friend}/>
    </div>
    }
    </div>
    )
}