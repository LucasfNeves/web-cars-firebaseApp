import { FiTrash, FiUpload } from 'react-icons/fi'
import { Container } from '../../../components/Container'
import { PainelHeader } from '../../../components/PainelHeader'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/Input'
import { ChangeEvent, useContext, useState } from 'react'
import { FormData, schemaNewCar } from '../../../schema/schemaNewCar'
import { AuthContext } from '../../../context/AuthContext'
import { v4 as uuidV4 } from 'uuid'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { db, storage } from '../../../services/firebaseConection'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'react-toastify'

interface imageItemProps {
  name: string
  url: string
  previewUrl: string
  uid: string
}

export function New() {
  const { user } = useContext(AuthContext)

  const [imageItem, setImageItem] = useState<imageItemProps[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schemaNewCar),
    mode: 'onChange',
  })

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0]

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        await handleUploadImage(image)
      } else {
        toast.error('Envie uma imagem do tipo PNG ou JPEG')
        e.target.value = ''
        return null
      }
    }
  }

  async function handleUploadImage(image: File) {
    if (!user?.uid) {
      return null
    }

    const currentUid = user?.uid
    const uidImage = uuidV4()

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const newImageItem = {
          name: uidImage,
          url: downloadURL,
          previewUrl: URL.createObjectURL(image),
          uid: currentUid,
        }

        setImageItem((images) => [...images, newImageItem])
        toast.success('Imagem enviada com sucesso!')
      })
    })
  }

  async function handleDeletImage(image: imageItemProps) {
    const imagePath = `images/${image.uid}/${image.name}`

    const imageRef = ref(storage, imagePath)

    try {
      await deleteObject(imageRef)
      setImageItem((images) => images.filter((item) => item.url !== image.url))
    } catch (error) {
      console.log(error)
    }
  }

  function onSubmit(data: FormData) {
    if (imageItem.length === 0) {
      toast.error('Envie uma imagem do carro')
      return null
    }

    const carListImages = imageItem.map((car) => {
      return {
        name: car.name,
        url: car.url,
        uid: car.uid,
      }
    })

    addDoc(collection(db, 'cars'), {
      name: data.name.toUpperCase(),
      model: data.model,
      year: data.year,
      km: data.km,
      city: data.city,
      whatsApp: data.whatsApp,
      price: data.price,
      description: data.description,
      images: carListImages,
      uid: user?.uid,
      owner: user?.name,
      createdAt: new Date(),
      carImages: carListImages,
    })

    toast.success('Carro cadastrado com sucesso!')
    setImageItem([])
    reset()
  }

  return (
    <Container>
      <PainelHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-start gap-2 mt-4">
        <label
          htmlFor="uploadFile"
          className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:min-w-48"
        >
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <input
            id="uploadFile"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileUpload}
          />
        </label>

        {imageItem.map((image) => (
          <div
            key={image.uid}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute"
              onClick={() => handleDeletImage(image)}
            >
              <FiTrash size={28} color="#fff" />
            </button>
            <img
              className="rounded-lg w-full h-32 object-cover"
              src={image.previewUrl}
              alt={image.name}
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-start gap-2 mt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <label
            className="flex  w-full flex-col gap-2 mb-2 font-medium"
            htmlFor="name"
          >
            Nome do carro
            <Input
              name="name"
              register={register}
              errors={errors.name?.message}
              placeholder="Nome do carro"
              type="text"
            />
          </label>
          <label
            className="flex  w-full flex-col gap-2 mb-2 font-medium"
            htmlFor="model"
          >
            Modelo do carro
            <Input
              name="model"
              register={register}
              errors={errors.model?.message}
              placeholder="Modelo do carro"
              type="text"
            />
          </label>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <label
              className="flex w-full flex-col gap-2 font-medium"
              htmlFor="year"
            >
              Ano do carro
              <Input
                name="year"
                register={register}
                errors={errors.year?.message}
                placeholder="Ano do carro"
                type="text"
              />
            </label>

            <label
              className="flex w-full flex-col gap-2 font-medium"
              htmlFor="km"
            >
              KM
              <Input
                name="km"
                register={register}
                errors={errors.km?.message}
                placeholder="Quilometragem do carro"
                type="text"
              />
            </label>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <label
              className="flex w-full flex-col gap-2 mb-2 font-medium"
              htmlFor="city"
            >
              Cidade
              <Input
                name="city"
                register={register}
                errors={errors.city?.message}
                placeholder="São Paulo - SP"
                type="text"
              />
            </label>

            <label
              className="flex w-full flex-col gap-2 mb-2 font-medium"
              htmlFor="whatsApp"
            >
              WhatsApp
              <Input
                name="whatsApp"
                register={register}
                errors={errors.whatsApp?.message}
                placeholder="011999101923...."
                type="text"
              />
            </label>
          </div>

          <label
            className="flex w-full flex-col gap-2 mb-2 font-medium"
            htmlFor="price"
          >
            Preço
            <Input
              name="price"
              register={register}
              errors={errors.price?.message}
              placeholder="300.000,00"
              type="text"
            />
          </label>

          <label
            className="flex w-full flex-col gap-2 mb-2 font-medium"
            htmlFor="description"
          >
            Descrição
            <div>
              <textarea
                className="border-2 w-full rounded-md h-24 px-2"
                {...register('description')}
                name="description"
                id="description"
                placeholder="Descrição do carro"
              ></textarea>
              {errors.description && (
                <span className="text-red-500 font-normal">
                  {errors.description.message}
                </span>
              )}
            </div>
          </label>

          <button
            type="submit"
            className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium"
          >
            {' '}
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  )
}
