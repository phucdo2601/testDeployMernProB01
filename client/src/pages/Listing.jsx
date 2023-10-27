import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaMapMarkedAlt,
  FaParking,
  FaShare
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);

  let { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const {
    currentUser
  } = useSelector((state) => state.user)

  useEffect(() => {
    const getListingById = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${id}`, {
          method: "GET",
        });
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    getListingById();
  }, [id]);

  console.log(loading);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    const loadingToast = toast.loading('Loading');
    /**
     * Setting after some excatly second will be update new state
     * In this case: I will set 3s (3000) that after event clicking share icon 3s, the new state will be update
     */
    setTimeout(() => {
      setCopied(false);
      toast.update(loadingToast, {
        render: "Copied Link is successfully",
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 5000,

      });
    }, 3000)
  }

  return (
    <>
      <main>
        {loading && (
          <>
            <div className="text-center my-7 text-2xl">Loading...</div>
          </>
        )}

        {error && (
          <>
            <div className="text-center my-7 text-2xl">
              Something went wrong
            </div>
          </>
        )}

        {listing && !loading && !error && (
          <>
            <div>
              <Swiper navigation>
                {listing.imageUrls.map((url) => (
                  <>
                    <SwiperSlide key={url}>
                      <div
                        className="h-[550px]"
                        style={{
                          background: `url(${url}) center no-repeat`,
                          backgroundSize: `cover`,
                        }}
                      ></div>
                    </SwiperSlide>
                  </>
                ))}
              </Swiper>

              <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                  <FaShare className="text-slate-500"
                    onClick={handleCopyLink}
                  />
              </div>

              <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                <p className="text-2xl font-semibold">
                  {listing.name} - ${' '} {
                    listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')
                  }
                </p>

                <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                    <FaMapMarkerAlt className="text-green-700"/>
                    {listing.address}
                </p>

                <div className="flex gap-4">
                    <p className="bg-red-900 w-full max-w[200px] text-white text-center p-1 rounded-md">
                        {
                          listing.type === 'rent' ? 'For rent' : "For sale"
                        }
                    </p>
                    
                    {
                      listing.offer && (
                        <>
                          <p className="bg-green-900 w-full max-w-[200px] text-white text-center gap-4 rounded-lg">
                            ${+listing.regularPrice - +listing.discountPrice} OFF
                          </p>
                        </>
                      )
                    }
                </div>
                <p className="text-slate-800 mt-2">
                      <span className="font-light text-black">
                        Description -
                      </span>
                      {listing.description}
                </p>

                <ul className="text-green-900 font-bold text-md flex flex-wrap items-center gap-4 sm:gap-6">
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBed
                      className="text-lg"
                    />
                    {
                      listing.bedrooms > 1 ? `${listing.bedrooms} rooms` : `${listing.bedrooms} room`
                    }
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBath
                      className="text-lg"
                    />
                    {
                      listing.bathrooms > 1 ? `${listing.bathrooms} rooms` : `${listing.bathrooms} room`
                    }
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaParking
                      className="text-lg"
                    />
                    {
                      listing.parking ? `Having Parking` : `No Parking`
                    }
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaChair
                      className="text-lg"
                    />
                    {
                      listing.furnished ? `Furnished` : `UnFunished`
                    }
                  </li>
                </ul>

                {
                  currentUser && listing.userRef !== currentUser._id && 
                  !contact && (
                    <>
                      <button type="button" onClick={() => {
                        setContact(true)
                      }} className="">
                          Show Contact
                      </button>
                    </>
                  )
                }

                {
                  !contact && <Contact listing={listing} />
                }
              </div>
              
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Listing;
