import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../services/firebaseConection'
import { Container } from '../../components/Container'
import { FaWhatsapp } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'

interface ImageCarProps {
  uid: string
  name: string
  url: string
}

interface CarProps {
  id: string
  model: string
  year: number
  price: number
  name: string
  city: string
  km: string
  images: ImageCarProps[]
  description: string
  createdAt: string
  owner: string
  uid: string
  whatsApp: string
}

export function CarDetails() {
  const [car, setCar] = useState<CarProps>()
  const [sliderPreview, setSliderPreview] = useState<number>(2)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return null
      }

      const docRef = doc(db, 'cars', id)

      getDoc(docRef)
        .then((snapshot) => {
          if (!snapshot.data()) {
            navigate('/')
          }

          setCar({
            id: snapshot.id,
            model: snapshot.data()?.model,
            year: snapshot.data()?.year,
            price: snapshot.data()?.price,
            name: snapshot.data()?.name,
            city: snapshot.data()?.city,
            km: snapshot.data()?.km,
            images: snapshot.data()?.images,
            description: snapshot.data()?.description,
            createdAt: snapshot.data()?.createdAt,
            owner: snapshot.data()?.owner,
            uid: snapshot.data()?.uid,
            whatsApp: snapshot.data()?.whatsApp,
          })
        })
        .catch((error) => {
          console.log('Error getting document:', error)
        })
    }

    loadCar()
  }, [id, navigate])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 720) {
        setSliderPreview(1)
      } else {
        setSliderPreview(2)
      }
    }

    if (window.innerWidth <= 720) {
      setSliderPreview(1)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPreview}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-96 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm-flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h2 className="font-bold text-3xl text-black">R$ {car?.price}</h2>
          </div>

          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>

              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição: </strong>
          <p className="mb-4">{car?.description}</p>

          <strong>Telefone / WhastApp</strong>
          <p>{car?.whatsApp}</p>

          <a
            className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer"
            href={`https://api.whatsapp.com/send?phone=55${car?.whatsApp}&text=Ol%C3%A1%2C%20vi%20seu%20an%C3%BAncio%20no%20site%20Web%20Carros%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20carro%20${car?.name}`}
            target="_blank"
            rel="noreferrer"
          >
            Conversar com vendedor
            <FaWhatsapp size={26} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  )
}
