import React, { useEffect, useState } from 'react'
import UserApi from '../api/users/UserApi';
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
  const ownerContactInfoId = listing.userRef;

  const [ownerContactInfo, setOwnerContactInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeMessageField = (e) => {
    setMessage(e.target.value);
  }

  useEffect(() => {
    console.log(ownerContactInfoId);
    const fetchOwnerContactInfo = async()=> {
      await UserApi.getOwnerContactInfo(ownerContactInfoId).then((res) => {
        if (res.data || res.status === 200 || res.status === 201) {
          setLoading(false);
          console.log(res.data);
          setOwnerContactInfo(res.data);
        }
      }).catch((error) => {
        console.log(error);
        setLoading(false)
      })
    }

    fetchOwnerContactInfo();
  }, [ownerContactInfoId]);

  return (
    <>
      {loading && (
          <>
            <div className="text-center my-7 text-sm">Loading...</div>
          </>
        )}
        {
          ownerContactInfo && (
            <>
              <div className='flex flex-col gap-2'>
                <p>
                  Contact <span className='font-semibold'>
                    {ownerContactInfo.username}
                  </span>{' '}
                  for {' '}
                  <span className='font-semibold'>
                    {listing.name.toLowerCase()}
                  </span>
                </p>

                <textarea
                  name='message'
                  id='message'
                  rows={`3`}
                  value={message}
                  onChange={onChangeMessageField}
                  placeholder='"Enter your messsage here...'
                  className='w-full border p-3 rounded-lg'
                >

                </textarea>

                <Link to={`mailto:${ownerContactInfo.email}?subjectRegrading ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
                  Send Message
                </Link>
              </div>
            </>
          )
        }
    </>
  )
}

export default Contact