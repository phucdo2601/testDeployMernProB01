import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';


const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/getListings?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/getListings?type=rent&limit=4');
        const data = await res.json();
        console.log(res.data);
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/getListings?type=sale&limit=4');
        const data = await res.json();
        console.log(res.data);
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <>
      <div>
        {/* top */}
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Find your next <span className="text-slate-500">
              perfect
            </span> place with ease
          </h1>

          <div className="text-gray-400 text-xs sm:text-sm">
            Phucdn learn MERN STACK Pro
            <br />
            Learning Basic MERN STACK PROJECT
          </div>
          <Link to={`/search`} className="
              text-xs sm:text-sm text-blue-800 font-bold hover:underline
            ">
            Let's get started...
          </Link>
        </div>


        {/* swiper */}
        <Swiper navigation>
          {
            offerListings && offerListings.length > 0 && offerListings.map((listing) => (
              <>
                <SwiperSlide>
                  <>
                    <div style={{
                      background: `url(${listing.imageUrls[0]}) center on-repeat`, backgroundSize: 'cover'
                    }} className="h-[500px]" key={listing._id}>

                    </div>
                  </>
                </SwiperSlide>
              </>
            ))
          }
        </Swiper>


        {/* listing results for offer, sale, and rent */}
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {
            offerListings && offerListings.length > 0 && (
              <>
                <div className="">
                  <div className="">
                    <h2>Recent offers</h2>
                    <Link to={`/search?offer=true`}>
                      Show more offer
                    </Link>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {offerListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              </>
            )
          }

          {rentListings && rentListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  )
}

export default Home