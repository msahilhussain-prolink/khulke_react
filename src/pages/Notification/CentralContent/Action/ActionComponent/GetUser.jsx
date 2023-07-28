const GetUser = ({ username }) => {
  return (
    <a style={{ color: "black", fontWeight: "bold", textDecoration: "none" }} href={`/profile/${username}/posts`}
      rel="noopener noreferrer">{`@${username}`}</a>
  )
};


export default GetUser;