import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
  const {
    currentUser, loading,
    error
  } = useSelector((state) => state.user);

  const fileRef = useRef();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({

  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showListingError, setShowListingError] = useState(false);

  const [userListings, setUserListings] = useState([]);

  console.log(loading);

  const dispatch = useDispatch();

  // console.log(formData);
  // console.log(filePerc);
  // console.log(fileUploadError);

  // console.log(filePerc);
  // console.log(file);

  //firebase storage
  // allow read;
  //     allow write: if request.resource.size < 2 * 1024 * 1024 &&
  //     request.resource.contentType.matches('image/*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
      console.log(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',

      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className="text-3xl font-semibold text-center my-7 ">Profile</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />

          <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile"
            className='
                rounded-full h-24 w-24 object-cover cursor-pointer
                self-center
              '
          />

          <p className='text-sm self-center'>
            {fileUploadError ? (
              <>
                <span className='text-red-700'>
                  Error Image Upload (Image must be less than 2 MB)
                </span>
              </>
            ) : filePerc > 0 && filePerc < 100 ? (
              <>
                <span className='text-green-700'>
                  {`Uploading ${filePerc}`}
                </span>
              </>
            ) : filePerc === 100 ? (
              <>
                <span className='text-green-700'>
                  Image Successfully updated!
                </span>
              </>
            ) : (
              <>

              </>
            )
            }
          </p>

          <input type="text" placeholder="Username" id="username" className='
              border p-3 rounded-lg
            '
            defaultValue={currentUser.username}
            onChange={handleChange}
          />

          <input type="text" placeholder="Email" id="email" className='
              border p-3 rounded-lg
            '
            defaultValue={currentUser.email}
            onChange={handleChange}
          />

          <input type="password" placeholder="Password" id="password" className='
              border p-3 rounded-lg
            '
            onChange={handleChange}
          />

          <button disabled={loading} className='
              bg-slate-700 text-white rounded-lg p-3 uppercase
              hover:opacity-80
            '>
            {
              loading ? 'Loading...' : 'Update'
            }
          </button>

          <Link to={`/create-listing`} className='
            bg-green-700 text-white p-3 rounded-lg uppercase text-center
            hover:opacity-95
          '>
            Create Listing
          </Link>
        </form>

        <div className='flex justify-between mt-5'>
          <span onClick={handleDeleteUser} className='
              text-red-700 cursor-pointer
            '>
            Delete Account
          </span>

          <span onClick={handleSignOut} className='
              text-red-700 cursor-pointer
            '>
            Sign Out
          </span>
        </div>

        <p className='text-red-700 mt-5'>{error ? error : ''}</p>
        <p className='text-green-700 mt-5'>{updateSuccess ? "Update Profile Successfully!" : ''}</p>

        <button type='button' className='text-green-700 w-full' onClick={handleShowListings}>
          Show Listings
        </button>

        <p className='text-red-700 mt-5'>{showListingError ? "Error showing Listing" : ''}</p>

        {
          userListings && userListings.length > 0 && (
            <>
              <div className="flex flex-col gap-4">
                <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
                {
                  userListings.map((listing) => (
                    <>
                      <div key={listing._id} className='border rounded-lg p-3 flex justify-between
                      items-center gap-4'>
                        <Link to={`/listing/${listing._id}`}>
                          <img
                            src={listing.imageUrls[0]}
                            alt='listing image'
                            className='
                              h-16 w-16 object-contain rounded-lg
                            '
                          />
                        </Link>

                        <Link className='text-slate-700 font-semibold hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
                          <p>{listing.name}</p>
                        </Link>

                        <div className="flex flex-col items-center">
                          <button type='button' onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>
                            Delete
                          </button>

                          <Link to={`/update-listing/${listing._id}`}>
                            <button className='text-green-700 uppercase'>Edit</button>
                          </Link>
                        </div>
                      </div>
                    </>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

export default Profile