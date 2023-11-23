import React,{Fragment, useState, useEffect} from 'react';
import {
    Row,Col,
    Card,Spinner,
    Button,
    Form,Label,Input,
    FormFeedback,
    Modal
} from 'reactstrap';
//Formik Validation.
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import Select from 'react-select';
//API's Services
import { PUT_RECURSO, GET_INICIALIZAR_RECURSO } from '../../../helpers/RecursosMto/url_helper';
//HOOKS
import useApiHelper from '../../../hooks/useApiHelper';

const ActualizarRecurso=props =>{
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const [tiposRecurso, setTiposRecurso] = useState([]);
    const {get,put} = useApiHelper();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: initialValues != null? initialValues : {
            nombre:"",
            ruta:"",
            tipo_recurso: null,
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es requerido").max(30,'El nombre debe tener máximo 30 caracteres.'),
            ruta: Yup.string().required("La ruta es requerida").max(60,'El nombre debe tener máximo 60 caracteres.'),
            tipo_recurso: Yup.object().required("El Modulo es requerido."),
        }),
        onSubmit: (values)=>{
            _registrarRecurso(values);
        }
    });

    useEffect(()=>{
        setModal(props.modal);
    },[props.modal]);
    useEffect(()=>{
        setInitialValues(props.initialValues);
    },[props.initialValues])
    useEffect(()=>{
        if(modal) _inicializar();
    },[modal]);
    /**FUNCION: Inicializa los servicios en el modal. */
    const _inicializar=async()=>{
        setLoading(true);
        const result = await get(GET_INICIALIZAR_RECURSO);
        const {modulos} = result;
        modulos.map(iterador=>{
            iterador.value = iterador.id;
            iterador.label = iterador.tipo_recurso;
        });
        setTiposRecurso(modulos);

        setLoading(false);
    }
    /**FUNCION: Actualiza los datos del recurso en el sistema. */
    const _registrarRecurso=async(values)=>{
        try{
            setLoading(true);
            const {id: id_recurso} = initialValues;
            const data={
                id_recurso,
                ...values
            };
            
            const result = await put(PUT_RECURSO+id_recurso, data);
            Swal.fire({
                title:"Actualizar Recurso",
                icon:"success",
                text:result.message,
                confirmButtonText:"Aceptar"
            });
            setLoading(false);
            _toggleModal();
        }catch(e){
            setLoading(false);
        }
    }

    const _toggleModal=()=>{
        setModal(!modal);
        setInitialValues(null);
        props.resetFlgs();
    }

    return(
        <Modal
        isOpen={modal}
        toggle={()=>{
            _toggleModal();
        }}
        >
            <div className="modal-header">
                <h5
                className="modal-title mt-0"
                id="myLargeModalLabel">
                    <i className="mdi mdi-account-plus-outline"></i>&nbsp;
                    Actualizar Recurso
                </h5>
                <button
                    onClick={() => {
                    _toggleModal()
                    }}
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <Card body>
                    <div className="p-2">
                        <Form
                            onSubmit={(e)=>{
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}
                        >
                            <div className="mt-3 mb-3">
                                {loading==false?(
                                    <Fragment>
                                        <Row>
                                    <Col>
                                    <Label className="form-label">Nombre</Label>
                                            <Input
                                            name="nombre"
                                            className="form-control"
                                            placeholder="Nombre"
                                            type="text"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.nombre || ""}
                                            invalid={
                                                validation.touched.nombre && validation.errors.nombre
                                                ? true
                                                : false
                                            }
                                            />
                                            {validation.touched.nombre && validation.errors.nombre ? (
                                                <FormFeedback type="invalid">
                                                    {validation.errors.nombre}
                                                </FormFeedback>
                                                ) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <Label className="form-label">Ruta</Label>
                                            <Input
                                            name="ruta"
                                            className="form-control"
                                            placeholder="Ruta"
                                            type="text"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.ruta || ""}
                                            invalid={
                                                validation.touched.ruta && validation.errors.ruta
                                                ? true
                                                : false
                                            }
                                            />
                                            {validation.touched.ruta && validation.errors.ruta ? (
                                                <FormFeedback type="invalid">
                                                    {validation.errors.ruta}
                                                </FormFeedback>
                                                ) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Label className="form-label"><b>Modulo</b></Label>
                                        <Select
                                            placeholder="Modulo"
                                            value={validation.values.tipo_recurso}
                                            onChange={selectedOption => {
                                                validation.setFieldValue("tipo_recurso", selectedOption);
                                            }}
                                            isSearchable={true}
                                            options={tiposRecurso}
                                            name="tipo_recurso"
                                            isLoading={false}
                                            
                                            />
                                        {validation.errors.tipo_recurso ? (
                                            <div className="error">{validation.errors.tipo_recurso}</div>
                                        ) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                       <div className="mt-3 d-grid">
                                       <Button
                                        outline
                                        color="success"
                                        className="btn-block"
                                        type="submit"
                                        >
                                        <i className="fas fa-plus"></i>&nbsp;&nbsp;Actualizar Recurso
                                        </Button>
                                       </div>
                                    </Col>
                                </Row>
                                    </Fragment>
                                ):(
                                    <div className="text-center">
                                        <Spinner color="primary" />
                                    </div>
                                )}
                            </div>

                        </Form>
                    </div>
                </Card>
            </div>
        </Modal>
    )
}

export default ActualizarRecurso;