import { FiTrash2 } from 'react-icons/fi'
import { Container } from '../../components/Container'
import { PainelHeader } from '../../components/PainelHeader'
import { useContext, useEffect, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConection'
import { AuthContext } from '../../context/AuthContext'
import { deleteObject, ref } from 'firebase/storage'

interface imageCarProps {
  id: string
  url: string
  name: string
  uid: string
}

interface CarProps {
  id: string
  name: string
  year: string
  price: string | number
  image: imageCarProps[]
  uid: string
  city: string
  km: string
}

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([])
  const [loadImage, setLoadImage] = useState<string[]>([])

  const { user } = useContext(AuthContext)

  useEffect(() => {
    async function getCars() {
      if (!user?.uid) {
        return null
      }

      const carsRef = collection(db, 'cars')

      const queryRef = query(carsRef, where('uid', '==', user?.uid))

      await getDocs(queryRef).then((snapshot) => {
        const listCars: CarProps[] = []

        snapshot.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name.toUpperCase(),
            year: doc.data().year,
            price: doc.data().price,
            image: doc.data().images,
            uid: doc.data().uid,
            city: doc.data().city,
            km: doc.data().km,
          })
        })

        setCars(listCars)
        console.log(listCars)
      })
    }

    getCars()
  }, [user])

  function handleImageLoad(id: string) {
    setLoadImage((prevImagesLoaded) => [...prevImagesLoaded, id])
  }

  async function handleDeleteCar(car: CarProps) {
    const docRef = doc(db, 'cars', car.id)
    await deleteDoc(docRef)

    car.image.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`

      const imageRef = ref(storage, imagePath)

      try {
        await deleteObject(imageRef)
      } catch (error) {
        console.log(error)
      }
    })
    setCars((prevCars) => prevCars.filter((item) => item.id !== car.id))
  }

  return (
    <Container>
      <PainelHeader />

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {cars.map((car) => {
          return (
            <section
              key={car.id}
              className="w-full bg-white rounded-lg relative"
            >
              <button
                onClick={() => {
                  handleDeleteCar(car)
                }}
                className="group absolute bg-white w-12 flex items-center justify-center h-12 rounded-full right-4 top-2 drop-shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105"
              >
                <FiTrash2
                  size={26}
                  className="text-zinc-700 transition-all duration-300 ease-in-out group-hover:text-red-500"
                />
              </button>
              <div
                className="w-full rounded-lg mb-2 h-72 max-h-72 bg-slate-300 "
                style={{
                  display: loadImage.includes(car.id) ? 'none' : 'block',
                }}
              ></div>
              <img
                src={car.image[0].url}
                alt=""
                className="w-full rounded-lg mb-2 max-h-70"
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadImage.includes(car.id) ? 'block' : 'none',
                }}
              />
              <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700">
                  {car.year} | {car.km} KM
                </span>
                <strong className="text-black font-bold mt-4 ">
                  R${' '}
                  {car.price.toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-black">Guarulhos - SP</span>
              </div>
            </section>
          )
        })}
      </main>
    </Container>
  )
}
