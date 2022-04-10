import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients(props) {
  const [ingredients, setIngredients] = useState([]);

  // const addIngredientHandler = (ingred) => {
  //   setIngredients((prevIngredients) => [
  //     ...prevIngredients,
  //     {
  //       id: Math.random().toString(),
  //       title: ingred.title,
  //       amount: ingred.amount,
  //     },
  //   ]);
  // };

  // useEffect(() => {
  //   fetchIngredientsFromDB();
  // }, []);

  // const fetchIngredientsFromDB = () => {
  //   fetch(process.env.REACT_APP_FIREBASE_ENDPOINT).then((response) => {
  //     return response
  //       .json()
  //       .then((data) => {
  //         const loadedIngredients = [];
  //         for (let key in data) {
  //           loadedIngredients.push({
  //             id: key,
  //             title: data[key].title,
  //             amount: data[key].amount,
  //           });
  //         }
  //         setIngredients(loadedIngredients);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });
  // };

  const saveIngredientInDB = (ingredient) => {
    console.log(JSON.stringify(ingredient));
    fetch(process.env.REACT_APP_FIREBASE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // .json() extracts the body and converts it to a javascript object
        // returns a promise
        return response.json();
      })
      .then((data) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: data.name, ...ingredient },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeItemHandler = (ingredientId) => {
    const newIngredientsList = ingredients.filter(
      (ele) => ele.id !== ingredientId
    );
    setIngredients(newIngredientsList);
  };

  const queryedIngredientsHandler = useCallback((comingIngredients) => {
    //
    setIngredients(comingIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={saveIngredientInDB} />

      <section>
        <Search onFilteredIngredients={queryedIngredientsHandler} />
        <IngredientList
          onRemoveItem={removeItemHandler}
          ingredients={ingredients}
        />
      </section>
    </div>
  );
}

export default Ingredients;
