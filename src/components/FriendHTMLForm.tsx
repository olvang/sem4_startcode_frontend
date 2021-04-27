/* eslint-disable @typescript-eslint/no-unused-vars */
import { IFriend } from "../interfaces/IFriend";



type FriendFormProps = {
  handleSubmit: any,
  handleChange: any
  friend: IFriend
}

const FriendHTMLForm = ({ handleSubmit, handleChange, friend }: FriendFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      {friend.id && 
      <label>
        ID <br />
        <input readOnly type="id" id="id" value={friend.id} disabled/>
      </label>
      }
      <br />
      <label>
        FirstName<br />
        <input type="text" id="firstName" value={friend.firstName} onChange={handleChange} />
      </label>
      <br />
      <label>
        LastName <br />
        <input type="text" id="lastName" value={friend.lastName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Email <br />
        <input type="email" id="email" value={friend.email} onChange={handleChange} />
      </label>
      <br />
      <label>
        Password <br />
        <input  type="password" id="password" value={friend.password} onChange={handleChange} />
      </label>
      <br />
      {friend.role && 
      <label>
        Role <br />
        <input type="role" id="role" value={friend.role} onChange={handleChange} />
      </label>
      }
      <br /><br />
      {<input type="submit" value={friend.id ? 'Update' : 'Add'} />}
    </form>
  );
}

export default FriendHTMLForm;