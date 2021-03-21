import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { Food as FoodComponent } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import api from '../../services/api';
import { FoodType } from '../../types';

import { FoodsContainer } from './styles';

type EditingFood = Omit<FoodType, 'available'>;

type Food =  Omit<FoodType, 'available'>;

export function Dashboard(): JSX.Element {
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<EditingFood>({} as EditingFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEdidtModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []); 

  async function handleAddFood(food: Food): Promise<void> {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(prevState => [...prevState, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<FoodType, 'id' | 'available'>
    ): Promise<void> {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEdidtModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodType): void {
    setEditingFood(food);
    setEdidtModalOpen(true);
  }


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
          foods.map(food => (
            <FoodComponent
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
