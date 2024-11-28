import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import Navbar from "../../components/Navbar";
import Logo from '../../assets/shopper-icon.png'
import TextInput from "../../components/Inputs/TextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useState } from "react";
import { EstimatedRide } from "../../DTO/EstimatedRide";
import { Driver } from "../../DTO/Driver";
import StaticMap from "./components/StaticMap";
import { DriverCard } from "./components/DriverCard";
import { convertSecondsToHoursAndMinutes } from "../../utils/convertSecondsToHoursAndMinutes";
import { api } from "../../lib/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'

interface FormData {
  customerId: string;
  origin: string;
  destination: string;
}

interface ConfirmRideBodyProps {
  customerId: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  }
  value: number
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [estimatedRide, setEstimatedRide] = useState<EstimatedRide | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver>({} as Driver)

  const navigate = useNavigate()

  const driverCardAnimation = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const validationSchema = yup.object().shape({
    customerId: yup.string().trim().required("Informe o id do usuário"),
    origin: yup.string().trim().required("Informe o endereço de origem"),
    destination: yup.string().trim().required("Informe o endereço de destino").test(
      "different-from-origin",
      "Origem e destino não podem ser iguais",
      function (value) {
        return value.toLowerCase() !== this?.parent?.origin?.toLowerCase();
      }
    ),
  })


  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const handleEstimateRide = async ({ customerId, origin, destination }: FormData) => {

    const estimateBody = {
      customer_id: customerId,
      origin,
      destination,
    }

    setLoading(true)
    try {
      const { data } = await api.post("/ride/estimate", estimateBody)
      if (data?.distance < 1) {
        const message = "Viagens com menos de 1km não podem ser realizadas."
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          },
        });
        return;
      }

      setEstimatedRide(data)
      const message = "Viagem estimada com sucesso! Escolha seu motorista para realizar o trajeto."
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)

      const message = error?.response?.data?.error_description
        ? error?.response?.data?.error_description :
        "Não foi possível estimar a viagem. Tente novamente mais tarde e/ou com outras localizações."

      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRide = async (
    {
      customerId,
      origin,
      destination,
      distance,
      driver,
      duration,
      value
    }: ConfirmRideBodyProps
  ) => {

    const confirmRideBody = {
      customer_id: customerId,
      origin,
      destination,
      distance,
      driver,
      duration,
      value
    }

    setLoading(true)
    try {
      await api.patch("/ride/confirm", confirmRideBody)
      const message = "Viagem confirmada com sucesso. Bon voyage!"
      navigate('/history')
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)

      const message = error?.response?.data?.error_description
        ? error?.response?.data?.error_description :
        "Não foi possível confirmar a viagem. Tente novamente mais tarde."

      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <>
        <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
          <Navbar />
          {!estimatedRide ? (
            <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row">
              {loading ? (
                <Loader />
              ) : (
                <div
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(handleEstimateRide)();
                    }
                  }}
                  className="flex flex-col gap-4 items-center justify-center p-8 md:w-96 bg-black rounded-md border-gray-800">
                  <img alt="Shopper logo" src={Logo} className="w-12 h-12 bg-transparent" />
                  <p className="text-xl text-gray-200 font-bold">Solicitação de viagem</p>
                  <Controller
                    control={control}
                    name="customerId"
                    render={({ field }) => (
                      <TextInput
                        placeholder="Id do usuário"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.customerId && (
                    <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                      {errors.customerId.message}
                    </p>
                  )}
                  <Controller
                    control={control}
                    name="origin"
                    render={({ field }) => (
                      <TextInput
                        placeholder="Endereço de origem"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.origin && (
                    <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                      {errors.origin.message}
                    </p>
                  )}

                  <Controller
                    control={control}
                    name="destination"
                    render={({ field }) => (
                      <TextInput
                        placeholder="Endereço de destino"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {errors.destination && (
                    <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                      {errors.destination.message}
                    </p>
                  )}

                  <Button
                    label="Estimar"
                    onClick={handleSubmit(handleEstimateRide)}
                  />
                </div>
              )}
            </div>
          ) : (
            loading ? (
              <Loader />
            ) : (
              <div className="flex rounded-md flex-col items-center justify-center flex-grow md:py-0 py-4">

                <div className="flex flex-col lg:flex-row lg:gap-0 gap-2 items-center justify-between md:max-w-[1280px] w-full px-6">
                  <p className="text-xl text-gray-200 font-bold">
                    Tempo estimado: {convertSecondsToHoursAndMinutes(Number(estimatedRide.duration))}
                  </p>

                  <p className="text-xl text-gray-200 font-bold">
                    Distância estimada: {estimatedRide.distance} km
                  </p>
                </div>

                <div className="flex flex-col gap-8 md:flex-row items-center justify-center md:max-w-[1280px] w-full p-6">

                  <StaticMap
                    origin={[estimatedRide.origin.latitude, estimatedRide.origin.longitude]}
                    destination={[estimatedRide.destination.latitude, estimatedRide.destination.longitude]}
                  />

                  <div className="bg-black p-8 md:w-[500px] w-full flex flex-col gap-4 rounded-md overflow-auto h-96 md:h-[650px]">
                    {estimatedRide.options.map((driver, index) => (
                      <motion.div
                        key={driver.id}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={driverCardAnimation}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <DriverCard
                          key={driver.id}
                          driver={driver}
                          isSelected={selectedDriver?.id === driver.id}
                          onClick={() => setSelectedDriver(driver)}
                        />
                      </motion.div>
                    ))}
                  </div>


                </div>
                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={() => setEstimatedRide(null)}
                    label="Voltar"
                    bgColor="bg-red-500"
                  />

                  <Button
                    onClick={() => handleConfirmRide({
                      customerId: getValues("customerId"),
                      origin: getValues("origin"),
                      destination: getValues("destination"),
                      distance: estimatedRide.distance,
                      duration: estimatedRide.duration,
                      driver: {
                        id: selectedDriver.id,
                        name: selectedDriver.name
                      },
                      value: selectedDriver.value
                    })}
                    label="Confirmar"
                    disabled={!selectedDriver?.id}
                  />
                </div>
              </div>
            )
          )}
        </div>

      </>
    </>
  );
}