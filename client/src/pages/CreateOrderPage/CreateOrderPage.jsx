import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import useEth from '../../contexts/EthContext/useEth';
import { CONSORTIUM_KEYS } from '../../constants/constants';
import './createOrderPage.scss';

export const CreateOrderPage = () => {

  // const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const [textFile, setTextFile] = useState({})
  const [publicKeys, setPublicKeys] = useState([])

  const {
    state: {
      userAccount,
      SupplyChainInstance,
    }, dispatch,
  } = useEth();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      supplier: '',
      customer: '',
      deliveryCompany: '',
      customs: ''
    },
    onSubmit: async ({
                       title,
                       description,
                       supplier,
                       customer,
                       deliveryCompany,
                       customs
                     }) => {
      if (!publicKeys.length) {
        alert("You should specify recipients.")
      } else if (
        title &&
        description &&
        supplier &&
        customer &&
        deliveryCompany &&
        customs) {

        setIsDisabled(true)

        SupplyChainInstance.methods.createOrder(
          title,
          description,
          supplier,
          customer,
          deliveryCompany,
          customs
        ).send({ from: userAccount, privateFor: publicKeys })
        .then(() => {
          SupplyChainInstance.methods.increaseTotalCount()
          .send({ from: userAccount, privateFor: CONSORTIUM_KEYS })
        })
        .then(() => {
          console.log("done!");
        })
        .finally(() => {
          setIsDisabled(false)
        })
      } else {
        alert("All field are required.")
      }
    }
  });

  useEffect(() => {
    if (textFile.name) {
      let fileData = new FileReader();
      fileData.onloadend = (e) => {
        const keysString = e.target.result;
        const publicKeysArray = keysString.split(/\r?\n/).filter(key => key)
        console.log(publicKeysArray);

        setPublicKeys(publicKeysArray);
      };
      fileData.readAsText(textFile);
    }
  }, [textFile]);


  return (
    <PageLayout>
      <div className="create-order-page">
        <div className="create-order">
          <h1>Create a new order</h1>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="title">
              Order title
              <input
                id="title"
                placeholder="Enter title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </label>

            <label htmlFor="description">
              Description
              <input
                id="description"
                placeholder="Enter description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </label>

            <label htmlFor="description">
              Supplier address
              <input
                id="supplier"
                placeholder="Enter address"
                name="supplier"
                onChange={formik.handleChange}
                value={formik.values.supplier}
              />
            </label>

            <label htmlFor="description">
              Customer address
              <input
                id="customer"
                placeholder="Enter address"
                name="customer"
                onChange={formik.handleChange}
                value={formik.values.customer}
              />
            </label>

            <label htmlFor="deliveryCompany">
              Delivery company address
              <input
                id="deliveryCompany"
                placeholder="Enter address"
                name="deliveryCompany"
                onChange={formik.handleChange}
                value={formik.values.deliveryCompany}
              />
            </label>

            <label htmlFor="customs">
              Customs address
              <input
                id="customs"
                placeholder="Enter address"
                name="customs"
                onChange={formik.handleChange}
                value={formik.values.customs}
              />
            </label>

            <label htmlFor="file">
              Keys text file upload
              <input
                id="file"
                className="upload-file-input"
                name="file"
                type="file"
                onChange={(event) => {
                  setTextFile(event.currentTarget.files[0]);
                }}
              />
            </label>

            <button className={isDisabled ? "disabled-button" : "form-button"} type="submit"
                    disabled={isDisabled}>{isDisabled ? "Sending..." : "Submit"}</button>
          </form>
        </div>
        {publicKeys.length ? <div className="recipients-list-wrapper">
          <h2>Recipients list</h2>
          <ul className="recipients-list">
            {publicKeys.map((key, index) => <li key={index}
                                                className="recipients-list-item">{key}</li>)}
          </ul>
        </div> : null}
      </div>
    </PageLayout>
  );
};
