import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import Navbar from "../../components/Navbar";
import Logo from '../../assets/shopper-icon.png'
import TextInput from "../../components/Inputs/TextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useState } from "react";
import { api } from "../../lib/axios";
import { toast } from "react-toastify";
import { MinDriverCard } from "./components/MinDriverCard";
import { Ride } from "../../DTO/Ride";
import { HistoryCard } from "./components/HistoryCard";
import Pagination from "./components/Pagination";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'

interface FormData {
  customerId: string;
}

const drivers = [
  { id: 1, name: "Homer Simpson" },
  { id: 2, name: "Dominic Toretto" },
  { id: 3, name: "James Bond" },
]

export default function History() {
  const [loading, setLoading] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null)
  const [rides, setRides] = useState<Ride[]>([])
  const [currentPage, setCurrentPage] = useState(1);

  console.log(rides)

  const navigate = useNavigate()

  const itemsPerPage = 3

  const historyCardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const minDriverCardAnimation = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const paginatedRides = rides.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validationSchema = yup.object().shape({
    customerId: yup.string().trim().required("Informe o id do usuário"),
    driverId: yup.number().optional(),
  })
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const cleanForm = () => {
    reset();
    setSelectedDriverId(null)
  }

  const handleToggleSelectDriver = (driverId: number) => {
    if (driverId === selectedDriverId) setSelectedDriverId(null)
    else setSelectedDriverId(driverId)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFetchRides = async ({ customerId }: FormData) => {

    setLoading(true)
    try {
      const getUrl =
        selectedDriverId
          ? `/ride/${customerId}?driver_id=${selectedDriverId}`
          : `/ride/${customerId}`

      const { data } = await api.get(getUrl)

      setRides(data.rides)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)

      const message = error?.response?.data?.error_description
        ? error?.response?.data?.error_description :
        "Não foi possível buscar as viagens. Tente novamente mais tarde."

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
          {rides.length === 0 ? (
            <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row p-6">
              {loading ? (
                <Loader />
              ) : (
                <div
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(handleFetchRides)();
                    }
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="flex flex-col gap-12 md:flex-row items-center justify-center md:max-w-[1280px] w-full p-6">
                    <div
                      className="flex flex-col gap-4 items-center justify-center p-8 md:w-96 w-full h-96 bg-black rounded-md border-gray-800">
                      <img alt="Shopper logo" src={Logo} className="w-12 h-12 bg-transparent" />
                      <p className="text-xl text-gray-200 font-bold">Buscar viagens</p>

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
                        <p className="text-red-500 text-sm font-bold self-center mt-[-12px]">
                          {errors.customerId.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-center md:w-[450px] mt-[-32px] w-full">
                      <p className="text-xl text-gray-200 font-bold">
                        Filtrar por motorista
                      </p>

                      <div className="bg-black p-8 md:w-[500px] w-full flex flex-col gap-4 rounded-md overflow-auto h-96">
                        {drivers.map((driver, index) => (
                          <motion.div
                            key={driver.id}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={historyCardAnimation}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <MinDriverCard
                              key={driver.id}
                              driverId={driver.id}
                              driverName={driver.name}
                              isSelected={selectedDriverId === driver.id}
                              onClick={() => handleToggleSelectDriver(driver.id)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={() => navigate('/')}
                      label="Voltar"
                      bgColor="bg-red-500"
                    />

                    <Button
                      label="Buscar"
                      onClick={handleSubmit(handleFetchRides)}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            loading ? (
              <Loader />
            ) : (
              <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row">
                <div className="flex flex-col items-center justify-center gap-8 p-6">
                  <p className="text-xl text-gray-200 font-bold">
                    Histórico de viagens
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    {paginatedRides.map((ride, index) => (
                      <motion.div
                        key={ride.id}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={minDriverCardAnimation}
                        transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                      >
                        <HistoryCard
                          key={ride.id}
                          ride={ride}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <Pagination
                    totalItems={rides.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />

                  <Button
                    onClick={() => {
                      cleanForm();
                      setRides([]);
                    }}
                    label="Voltar"
                    bgColor="bg-red-500"
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