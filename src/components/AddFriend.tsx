/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { IFriend } from "../interfaces/IFriend"
import { gql, useMutation, ApolloClient } from "@apollo/client"
import FriendHTMLForm from "./FriendHTMLForm";

const ADD_FRIEND = gql`
mutation 
createFriend($friend : FriendInput){
  createFriend(input:$friend){
   firstName
    lastName
    email
    role
    id
  }
}`

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

type AddFriendProps = {
  initialFriend?: IFriend,
  allowEdit: true
}

interface IKeyableFriend extends IFriend {
  [key: string]: any
}


const AddFriend = ({ initialFriend, allowEdit }: AddFriendProps) => {
  const EMPTY_FRIEND: IFriend = { firstName: "", lastName: "", password: "", email: "" }
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [addFriend, { data }] = useMutation(
    ADD_FRIEND,
    {
      update(cache, { data }) {
        const addedFriend = data.createFriend;
        const d: any = cache.readQuery({ query: ALL_FRIENDS })
        let allFriends = d.getAllFriends || []
        cache.writeQuery({ query: ALL_FRIENDS, data: { getAllFriends: [...allFriends, addedFriend] } })
      }
    })

  const [friend, setFriend] = useState({ ...newFriend })
  const [readOnly, setReadOnly] = useState(!allowEdit)

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const id = event.currentTarget.id;
    var friendToChange: IKeyableFriend = { ...friend };
    friendToChange[id] = event.currentTarget.value;
    setFriend({ ...friendToChange })
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addFriend({
      variables: {
        friend: { ...friend }
      }
    })
    setFriend({ ...EMPTY_FRIEND })
  }

  return (
    <FriendHTMLForm handleChange={handleChange} handleSubmit={handleSubmit} friend={friend}/>
  );
}

export default AddFriend;