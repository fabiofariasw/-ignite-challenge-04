import { useEffect, useState } from "react";

import api from "../../services/api";

import Header from "../../components/Header";
import Food, { FProps } from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";


import { FoodsContainer } from "./styles";

interface StateProps {
  foods: FProps[];
  editingFood: FProps | any;
  modalOpen: boolean;
  editModalOpen: boolean;
}

function Dashboard() {
  const [state, setState] = useState<StateProps>({
    foods: [],
    editingFood: {},
    modalOpen: false,
    editModalOpen: false,
  });
  const { foods, editingFood, modalOpen, editModalOpen } = state;

  const toggleModal = () => {
    setState((prevState) => ({ ...prevState, modalOpen: !modalOpen }));
  };

  const toggleEditModal = () => {
    setState((prevState) => ({ ...prevState, editModalOpen: !editModalOpen }));
  };

  const handleEditFood = (food: FProps) => {
    setState((prevState) => ({
      ...prevState,
      editingFood: food,
      editModalOpen: true,
    }));
  };

  const handleAddFood = async (food: FProps) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setState((prevState) => ({
        ...prevState,
        foods: [...foods, response.data],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FProps) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setState((prevState) => ({
        ...prevState,
        foods: foodsUpdated,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);
    setState((prevState) => ({ ...prevState, foods: foodsFiltered }));
  };

  useEffect(() => {
    (async () => {
      const response = await api.get("/foods");
      setState((prevState) => ({ ...prevState, foods: response.data }));
    })();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods?.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
