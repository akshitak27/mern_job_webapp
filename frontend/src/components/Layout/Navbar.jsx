import React, { useState } from 'react'

 const Navbar = () => {
  const [show, setShow]=useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const handleLogout=async()=>{
    try {
      const response=await axios.get("",
        {
          withCredentials:true
        }
      );
      toast.success(response.data.message);
      setIsAuthorized:false;
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message),
      setIsAuthorized(true);
    }
  };

  return (
    <div>Navbar</div>
  )
}
export default Navbar
