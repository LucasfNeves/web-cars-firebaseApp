import { useEffect, useState } from 'react'
import { Container } from '../../components/Container'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConection'
import { Link } from 'react-router-dom'

interface CarImageProps {
  id: string
  url: string
}

interface CarProps {
  id: string
  name: string
  year: string
  price: string | number
  image: CarImageProps[]
  uid: string
  city: string
  km: string
}

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([])
  const [loadImage, setLoadImage] = useState<string[]>([])
  const [inputSearch, setInputSearch] = useState<string>('')

  useEffect(() => {
    getCars()
  }, [])

  async function getCars() {
    const carsRef = collection(db, 'cars')

    const queryRef = query(carsRef, orderBy('createdAt', 'desc'))

    await getDocs(queryRef).then((snapshot) => {
      const listCars: CarProps[] = []
      snapshot.forEach((doc) => {
        listCars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          price: doc.data().price,
          image: doc.data().images,
          uid: doc.data().uid,
          city: doc.data().city,
          km: doc.data().km,
        })
      })

      setCars(listCars)
    })
  }

  function handleImageLoad(id: string) {
    setLoadImage((prevImagesLoaded) => [...prevImagesLoaded, id])
  }

  async function handleSeachCar() {
    if (inputSearch === '') {
      getCars()
      return null
    }

    setCars([])
    setLoadImage([])

    const q = query(
      collection(db, 'cars'),
      where('name', '>=', inputSearch.toUpperCase()),
      where('name', '<=', inputSearch.toUpperCase() + '\uf8ff'),
    )

    const querySnapshot = await getDocs(q)

    const listCars: CarProps[] = []

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        price: doc.data().price,
        image: doc.data().images,
        uid: doc.data().uid,
        city: doc.data().city,
        km: doc.data().km,
      })
    })

    setCars(listCars)
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-md w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do carro..."
          type="text"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <button
          onClick={handleSeachCar}
          className="bg-red-500 px-8 rounded-lg text-white font-medium h-9 text-lg"
        >
          Buscar
        </button>
      </section>
      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => {
          return (
            <Link to={`/car/${car.id}`} key={car.id}>
              <section className="w-full bg-white rounded-lg shadow-lg">
                <div
                  className="w-full rounded-lg h-72 bg-slate-300 "
                  style={{
                    display: loadImage.includes(car.id) ? 'none' : 'block',
                  }}
                ></div>
                <img
                  src={car.image[0].url}
                  alt=""
                  className="w-full rounded-lg md-2 max-h-72 object-cover hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer"
                  onLoad={() => handleImageLoad(car.id)}
                  style={{
                    display: loadImage.includes(car.id) ? 'block' : 'none',
                  }}
                />
                <p className="font-bold mt-1 bm-2 px-2">{car.name}</p>
                <div className="flex flex-col px-2">
                  <span className="text-zinc-600 mb-6">
                    {car.year} | KM : {car.km}
                  </span>
                  <strong className="text-black font-medium text-xl">
                    {car.price}
                  </strong>
                </div>

                <div className="w-full h-px bg-slate-200 my-2"></div>

                <div className="px-2 pb-2">
                  <span className="text-zinc-700">{car.city}</span>
                </div>
              </section>
            </Link>
          )
        })}
      </main>
    </Container>
  )
}
