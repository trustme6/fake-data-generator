import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { faker, fakerPL, fakerUK, fakerTR } from '@faker-js/faker';
import { simpleFaker } from '@faker-js/faker';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'bootstrap/dist/css/bootstrap.min.css';


const generateRandomSeed = () => {
  return Math.floor(Math.random() * 100000).toString();
};

const FakeDataGenerator = () => {
  const [region, setRegion] = useState('Turkish');
  const [errorsSlider, setErrorsSlider] = useState(0);
  const [errorsField, setErrorsField] = useState('0');
  const [seed, setSeed] = useState(generateRandomSeed());
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [scrollCount, setScrollCount] = useState(0);

  

  const generateFakePhone = (region) => {
    switch (region) {
      case 'Turkish':
        return fakerTR.phone.number();
      case 'Poland':
        return fakerPL.phone.number();
      case 'Ukraine':
        return fakerUK.phone.number();
      default:
        return fakerTR.phone.number();
    }
  };

  const generateFakeName = (region) => {
    switch (region) {
      case 'Turkish':
        return fakerTR.person.fullName();
      case 'Poland':
        return fakerPL.person.fullName();
      case 'Ukraine':
        return fakerUK.person.fullName();
      default:
        return fakerTR.person.fullName();
    }
  };

  const generateFakeAddress = (region) => {
    switch (region) {
      case 'USA':
        return fakerTR.location.streetAddress();
      case 'Poland':
        return fakerPL.location.streetAddress();
      case 'Ukraine':
        return fakerUK.location.streetAddress();
      default:
        return fakerTR.location.streetAddress();
    }
  };

  const generateFakeData = (count, errors, seed, page, region) => {
    faker.seed(seed);
    const data = [];

    for (let i = 0; i < count; i++) {
      let number = i + 1 + page * count;
      let id = simpleFaker.string.uuid();
      let name = generateFakeName(region);
      let address = generateFakeAddress(region);
      const phone = generateFakePhone(region);

      if (errors > 0) {
        const errorIndex = Math.floor(Math.random() * 3);
        const errorPosition = Math.floor(Math.random() * name.length);

        switch (errorIndex) {
          case 0:
            name = name.slice(0, errorPosition) + name.slice(errorPosition + 1);
            break;
          case 1:
            const randomChar = region[Math.floor(Math.random() * region.length)];
            name = name.slice(0, errorPosition) + randomChar + name.slice(errorPosition);
            break;
          case 2:
            if (errorPosition < name.length - 1) {
              name =
                name.slice(0, errorPosition) +
                name[errorPosition + 1] +
                name[errorPosition] +
                name.slice(errorPosition + 2);
            }
            break;
          default:
            break;
        }
      }

      data.push({ number, id, name, address, phone });
    }

    return data;
  };

  const generateCombinedSeed = (userSeed, page) => {
    return userSeed + page;
  };

  const applyRandomError = (inputString, errorCount, alphabet) => {
    let result = inputString;

    for (let i = 0; i < errorCount; i++) {
      const errorType = Math.floor(Math.random() * 3);

      switch (errorType) {
        case 0:
          const deletePosition = Math.floor(Math.random() * result.length);
          result =
            result.slice(0, deletePosition) + result.slice(deletePosition + 1);
          break;
        case 1:
          const addPosition = Math.floor(Math.random() * (result.length + 1));
          const randomChar =
            alphabet[Math.floor(Math.random() * alphabet.length)];
          result =
            result.slice(0, addPosition) + randomChar + result.slice(addPosition);
          break;
        case 2:
          const swapPosition = Math.floor(Math.random() * (result.length - 1));
          result =
            result.slice(0, swapPosition) +
            result[swapPosition + 1] +
            result[swapPosition] +
            result.slice(swapPosition + 2);
          break;
        default:
          break;
      }
    }

    return result;
  };

  const fetchData = () => {
    if (scrollCount < 5) {
      const combinedSeed = generateCombinedSeed(seed, page);
      const alphabet = getAlphabet(region);

      const newData = generateFakeData(
        rowsPerPage,
        errorsSlider,
        combinedSeed,
        page + 1,
        region
      ).map((row) => ({
        ...row,
        name: applyRandomError(row.name, errorsSlider, alphabet),
        address: applyRandomError(row.address, errorsSlider, alphabet),
        phone: applyRandomError(row.phone, errorsSlider, alphabet),
      }));

      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
      setScrollCount((prevCount) => prevCount + 1);
    }
  };

  const handleSliderChange = (event) => {
    const newValue = parseFloat(event.target.value);
    setErrorsSlider(newValue);
    setErrorsField(newValue.toString());
  };

  const handleFieldChange = (event) => {
    const newValue = parseFloat(event.target.value);
    const validValue = isNaN(newValue) ? 0 : Math.min(newValue, 1000);
    setErrorsSlider(validValue / 100);
    setErrorsField(validValue.toString());
  };

  useEffect(() => {
    setScrollCount(0);
    const combinedSeed = generateCombinedSeed(seed, page);
    const alphabet = getAlphabet(region);

    const newData = generateFakeData(
      rowsPerPage,
      errorsSlider,
      combinedSeed,
      0,
      region
    ).map((row) => ({
      ...row,
      name: applyRandomError(row.name, errorsSlider, alphabet),
      address: applyRandomError(row.address, errorsSlider, alphabet),
      phone: applyRandomError(row.phone, errorsSlider, alphabet),
    }));

    setData(newData);
  }, [region, errorsSlider, seed, rowsPerPage]);

 const getAlphabet = (region) => {
  switch (region) {
    case 'Turkish':
      return 'abcçdefgğhıijklmnoöprsştuüvyz';
    case 'Poland':
      return 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';
    case 'Ukraine':
      return 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя';
    case 'USA':
      return 'abcdefghijklmnopqrstuvwxyz';
    default:
      return '';
  }
};

  return (
    <div>
      <Form>
        <Form.Group controlId="region">
          <Form.Label>Регион:</Form.Label>
          <Form.Control
            as="select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="Turkish">Турция</option>
            <option value="Poland">Польша</option>
            <option value="Ukraine">Украина</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="errorsSlider">
          <Form.Label>Ошибки (слайдер): {errorsSlider}</Form.Label>
          <Form.Control
            type="range"
            min={0}
            max={10}
            step={0.25}
            value={errorsSlider}
            onChange={handleSliderChange}
          />
        </Form.Group>
        <Form.Group controlId="errorsField">
          <Form.Label>Ошибки:</Form.Label>
          <Form.Control
            type="number"
            min={0}
            max={1000}
            step={0.1}
            value={errorsField}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="seed">
          <Form.Label>Seed:</Form.Label>
          <Form.Control
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={() => setSeed(generateRandomSeed())}>
          Random Seed
        </Button>
      </Form>

      <InfiniteScroll
        dataLength={data.length}
        next={fetchData}
        hasMore={scrollCount < 5}
        loader={<h4>Loading...</h4>}
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Номер</th>
              <th>Идентификатор</th>
              <th>ФИО</th>
              <th>Адрес</th>
              <th>Телефон</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.number}>
                <td>{row.number}</td>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.address}</td>
                <td>{row.phone}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </InfiniteScroll>

      <div>
        <span>Rows per page:</span>
        <Form.Control
          as="select"
          onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          value={rowsPerPage}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </Form.Control>
        <span>Page: {page + 1}</span>
        <Button
          variant="primary"
          onClick={() => setPage((prevPage) => Math.max(0, prevPage - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FakeDataGenerator;
