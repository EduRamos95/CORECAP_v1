import React, { useState, useContext, useEffect } from 'react';
//import List from '@mui/material/List';
//import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, Grid, LinearProgress, ListItem } from '@mui/material';
//import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// import { top100Films } from '../assets/top100'
import AssignmentIcon from '@mui/icons-material/Assignment';
//import { grey } from '@mui/material/colors';
import { converInverM, newInversionista } from '../assets/data_inversionistas'
import { convProductoM, newProDucto } from '../assets/data_producto'
import { convCateM, newCategoria } from '../assets/data_levantamiento'
import { convDocM, newTipoDoc } from '../assets/data_documento'
//import { display } from '@mui/system';
import { SelectionContext } from '../context/SelectionContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import {stylesAutocomplete} from '../common/dataComponent';

interface deFaultAPI {
    id: string | null
    name: string
}

// interface Option {
//     value: string;
//   }

export const LatMenuLoad: React.FC<{}> = (): JSX.Element => {

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));
    const isXl = useMediaQuery(theme.breakpoints.only('xl'));

    const initialAPI: deFaultAPI[] = [
        {
            id: '',
            name: 'Loading...'
        }
    ]

    const [apiInversionista, setApiInversionista] = useState<newInversionista[] | deFaultAPI[]>(initialAPI)
    const [apiProducto, setApiProducto] = useState<newProDucto[] | deFaultAPI[]>(initialAPI)
    const [apiTipoDoc, setApiTipoDoc] = useState<newTipoDoc[] | deFaultAPI[]>(initialAPI)
    const [apiCategoria, setApiCategoria] = useState<newCategoria[] | deFaultAPI[]>(initialAPI)
    const [loadingAPI1, setLoadingAPI1] = useState<boolean>(true)
    const [loadingAPI2, setLoadingAPI2] = useState<boolean>(true)
    const [loadingAPI3, setLoadingAPI3] = useState<boolean>(true)
    const [loadingAPI4, setLoadingAPI4] = useState<boolean>(true)
    //const [loadingErrorAPI5, setLoadingErrorAPI5] = useState<boolean>(true)




    interface filter {
        text: string,
        icon: JSX.Element,
        path: string,
        tabla: Array<newTipoDoc | newCategoria | newProDucto | newInversionista | deFaultAPI>,
        load: boolean,
        keyui: string
    }

    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:8000/api/inversionistas')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    const sortedJson = data.sort(compareObjectsByField("apPaterno"));
                    setLoadingAPI1(false)
                    setApiInversionista(converInverM(sortedJson))
                })
                .catch(error => {
                    console.error('There was a problem with the network request:', error);
                });

            fetch('http://localhost:8000/api/tipo-documentos')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    const sortedJson = data.sort(compareObjectsByField("nombre"));
                    setLoadingAPI2(false)
                    setApiTipoDoc(convDocM(sortedJson))
                })
                .catch(error => {
                    console.error('There was a problem with the network request:', error);
                });
            fetch('http://localhost:8000/api/productos')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    const sortedJson = data.sort(compareObjectsByFieldNum("nombreProducto"));
                    setLoadingAPI3(false)
                    setApiProducto(convProductoM(sortedJson))
                })
                .catch(error => {
                    console.error('There was a problem with the network request:', error);
                });

            fetch('http://localhost:8000/api/categorias')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    const sortedJson = data.sort(compareObjectsByFieldNum("tipo"));
                    setLoadingAPI4(false)
                    setApiCategoria(convCateM(sortedJson))
                })
                .catch(error => {
                    console.error('There was a problem with the network request:', error);
                });
        };
        const timer = setTimeout(() => {
            fetchData();
        }, 2000);
        return () => clearTimeout(timer);
    }, [])

    // numero de opciones disponible
    const { selectedOption1, selectedOption2, selectedOption3, selectedOption4 } = useContext(SelectionContext);
    const { setSelectedOption1, setSelectedOption2, setSelectedOption3, setSelectedOption4 } = useContext(SelectionContext);
    //const {isAutocomplete1Enabled,isAutocomplete2Enabled,isAutocomplete3Enabled,isAutocomplete4Enabled} = useContext(SelectionContext);

    const FilterItems: Array<filter> = [
        {
            text: 'Inversionista',
            icon: <PersonIcon style={{ color: selectedOption1 ? '#000' : '' }}/>,
            path: '/',
            tabla: apiInversionista,
            load: loadingAPI1,
            keyui: "unico1"
        },
        {
            text: 'Documento',
            icon: <DescriptionIcon style={{ color: selectedOption2 ? '#000' : ''}}/>,
            path: '/',
            tabla: apiTipoDoc,
            load: loadingAPI2,
            keyui: "unico2",
        },
        {
            text: 'Producto',
            icon: <MapsHomeWorkIcon style={{ color: selectedOption3 ? '#000' : '' }}/>,
            path: '/',
            tabla: apiProducto,
            load: loadingAPI3,
            keyui: "unico3",
        },
        {
            text: 'Levantamiento / Emision',
            icon: <AssignmentIcon style={{ color: selectedOption4 ? '#000' : '' }}/>,
            path: '/',
            tabla: apiCategoria,
            load: loadingAPI4,
            keyui: "unico4",
        },
    ]
    //const {setIsAutocomplete1Enabled,setIsAutocomplete2Enabled,setIsAutocomplete3Enabled,setIsAutocomplete4Enabled} = useContext(SelectionContext);
    
    //     selectedOption1 ► Inversionista,
    //     selectedOption2 ► Tipo Doc,
    //     selectedOption3 ► Producto,
    //     selectedOption4 ► Categoria,

    // pasar la variable (selectedOption2)
    const handleDisableInversionista = (objD:newTipoDoc|null) => {
        // verificar que TipoDoc este seleccionado
        // para habilitar el campo Inversionista
        if(objD){
            return false;
        }else{
            setSelectedOption1(null);
            // setIsAutocomplete1Enabled(false);
            //value cambiar por ternaria en el mismo value....
            // true enviar a value ► null
            return true;
        }
        
    }

    // handleDisableInversionista(selectedOption2)

    // pasar la variable (selectedOption1,selectedOption2)
    const handleDisableProducto = (objInv:newInversionista|null, objDoc:newTipoDoc|null) => {
        // verificar que Inversionista este seleccionado
        // para habilitar el campo producto
        if(objInv && objDoc && (objDoc.nombre !== 'Ficha Cliente' )){
            return false;
        }else{
            setSelectedOption3(null);
            //value cambiar por ternaria en el mismo value....
            // true enviar a value ► null
            return true;
        }
    }
    // handleDisableProducto(selectedOption1,selectedOption2)

    // pasar la variable (selectedOption3)
    const handleDisableCategoria = (objPro:newProDucto | null) => {
        // verificar que Inversionista este seleccionado
        // para habilitar el campo producto
        if(objPro){
            return false;
        }else{
            setSelectedOption4(null);
            //value cambiar por ternaria en el mismo value....
            // true enviar a value ► null
            return true;
        }
    }
    // handleDisableCategoria(selectedOption3)

    // const [options, setOptions] = useState<string[]>([
    //     "1",
    //     "2",
    //     "3"
    //   ]);


    // ------ esta opcion no esta vinculada a ningun filtro ---------
     // -------- esta opcion habilitara un true o false ---------
      // -------- para el boton que esta en FileUpload ---------
    // setIsAutocomplete2Enabled();

    // const buttonFunction = () => {
    //     // Verifica que los Autocomplete habilitados no estén vacíos
    //     if (
    //       (isAutocomplete2Enabled && !options[0]) ||
    //       (isAutocomplete1Enabled && !options[1]) ||
    //       (isAutocomplete3Enabled && !options[2]) ||
    //       (isAutocomplete4Enabled && !options[3])
    //     ) {
    //         setIsAutocomplete2Enabled(false);
    //       console.log("Los campos habilitados no pueden estar vacíos.");
    //     } else {
    //         setIsAutocomplete2Enabled(true);
    //       console.log("Los campos están bien y el botón puede ser presionado.");
    //     }
    //   };

      //setOptions([newValue, options[1], options[2], options[3]]);
      function compareObjectsByField(fieldName: string) {
        return function(a: any, b: any) {
          if (a[fieldName] < b[fieldName]) {
            return -1;
          }
          if (a[fieldName] > b[fieldName]) {
            return 1;
          }
          return 0;
        }
      }

    function compareObjectsByFieldNum(fieldName: string) {
        return function(a: any, b: any) {
            const aValue = Number(a[fieldName].match(/\d+/)?.[0]);
            const bValue = Number(b[fieldName].match(/\d+/)?.[0]);
        
            if (aValue < bValue) {
            return -1;
            }
            if (aValue > bValue) {
            return 1;
            }
            return 0;
        }
    }

    function compareObjectsByNombre(a: any, b: any) {
        return a.tipo.localeCompare(b.tipo);
    }

    return (
        <Grid sx={
            {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                minWidth: '200px',
                maxWidth: '100%',
            }}>




            {/* para el filtro tipo de documento  */}
            <Grid item sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <ListItem
                    key={FilterItems[1].text}
                    sx={{ display: 'flex' }}>
                    <ListItemText >
                        <ListItemIcon >{FilterItems[1].icon}</ListItemIcon>
                        <Autocomplete
                            disablePortal
                            loading={FilterItems[1].load}
                            color='neutral'
                            id="combo-box-demo"
                            options={FilterItems[1].tabla}
                            getOptionLabel={option => option.name}
                            sx={{
                                bgcolor: stylesAutocomplete.bgwhite,
                                minWidth: isXs ? '340px' : isSm ? '570px' : isMd ? '800px' : isLg ? '500px' : isXl ? '700px' : null,
                            }}
                            renderInput={(params) => {
                                return (
                                    <TextField key={FilterItems[1].keyui} color='neutral' {...params} label={FilterItems[1].text} size='medium'
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {/* {loadingAPI ? <CircularProgress color="inherit" size={20} /> : null} */}
                                                    {FilterItems[1].load ? <Box sx={{ width: '100%' }}>
                                                        <LinearProgress color="inherit" />
                                                    </Box> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }} />
                                )
                            }}
                            onChange={(event, newValue) => {
                            return(
                                setSelectedOption2(newValue as newTipoDoc | null)
                            )}}

                        />
                    </ListItemText>
                </ListItem>
                {/* {selectedOption2 && <p>El ID seleccionado es actual: {selectedOption2.id}</p>} */}
            </Grid>


            {/* para el filtro inversionista  */}
            <Grid item sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <ListItem
                    key={FilterItems[0].text}
                    sx={{ display: 'flex' }}>
                    <ListItemText >
                        <ListItemIcon >{FilterItems[0].icon}</ListItemIcon>
                        <Autocomplete
                            disabled={handleDisableInversionista(selectedOption2) ? true : false}
                            value={handleDisableInversionista(selectedOption2) ? null : selectedOption1}
                            disablePortal
                            loading={FilterItems[0].load}
                            color='neutral'
                            id="combo-box-demo"
                            options={apiInversionista}
                            getOptionLabel={option => option.name}
                            sx={{
                                bgcolor: stylesAutocomplete.bgwhite,
                                minWidth: isXs ? '340px' : isSm ? '570px' : isMd ? '800px' : isLg ? '500px' : isXl ? '700px' : null,
                            }}
                            renderInput={(params) => {
                                return (
                                    <TextField key={FilterItems[0].keyui} color='neutral' {...params} label={FilterItems[0].text} size='medium'
                                        InputProps={
                                            params.InputProps && {
                                            ...params.InputProps
                                            , endAdornment: (
                                                <React.Fragment>
                                                    {/* {loadingAPI ? <CircularProgress color="inherit" size={20} /> : null} */}
                                                    {FilterItems[0].load ? <Box sx={{ width: '100%' }}>
                                                        <LinearProgress color="inherit" />
                                                    </Box> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }} />
                                )
                            }}
                            onChange={(event, newValue) => setSelectedOption1(newValue as newInversionista | null)}

                        />
                    </ListItemText>
                </ListItem>
                {/* {selectedOption1 && <p>El ID seleccionado es actual: {selectedOption1.id}</p>} */}
            </Grid>



            {/* para el filtro producto -> disable is fichacliente  */}
            <Grid item sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <ListItem
                    key={FilterItems[2].text}
                    sx={{ display: 'flex' }}>
                    <ListItemText>
                        <ListItemIcon >{FilterItems[2].icon}</ListItemIcon>
                        <Autocomplete
                            disabled={handleDisableProducto(selectedOption1,selectedOption2) ? true : false}
                            value={handleDisableProducto(selectedOption1,selectedOption2) ? null : selectedOption3}
                            disablePortal
                            loading={FilterItems[2].load}
                            color='neutral'
                            id="combo-box-demo"
                            options={apiProducto}
                            getOptionLabel={option => option.name}
                            sx={{
                                bgcolor: stylesAutocomplete.bgwhite,
                                minWidth: isXs ? '340px' : isSm ? '570px' : isMd ? '800px' : isLg ? '500px' : isXl ? '700px' : null,
                            }}
                            renderInput={(params) => {
                                return (
                                    <TextField key={FilterItems[2].keyui} color='neutral' {...params} label={FilterItems[2].text} size='medium'
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {/* {loadingAPI ? <CircularProgress color="inherit" size={20} /> : null} */}
                                                    {FilterItems[2].load ? <Box sx={{ width: '100%' }}>
                                                        <LinearProgress color="inherit" />
                                                    </Box> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }} />
                                )
                            }}
                            onChange={(event, newValue) => setSelectedOption3(newValue as newProDucto | null)}

                        />
                    </ListItemText>
                </ListItem>
                {/* {selectedOption3 && <p>El ID seleccionado es actual: {selectedOption3.id}</p>} */}
            </Grid>

            {/* para el filtro subcategoria -> disable if desactive in product  */}
            <Grid item sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <ListItem
                    key={FilterItems[3].text}
                    sx={{ display: 'flex' }}>
                    <ListItemText >
                        <ListItemIcon >{FilterItems[3].icon}</ListItemIcon>
                        <Autocomplete
                            disablePortal
                            disabled={handleDisableCategoria(selectedOption3) ? true : false}
                            value={handleDisableCategoria(selectedOption3) ? null : selectedOption4}
                            loading={FilterItems[3].load}
                            color='neutral'
                            id="combo-box-demo"
                            options={apiCategoria}
                            getOptionLabel={option => option.name}
                            sx={{
                                bgcolor: stylesAutocomplete.bgwhite,
                                minWidth: isXs ? '340px' : isSm ? '570px' : isMd ? '800px' : isLg ? '500px' : isXl ? '700px' : null,
                            }}
                            renderInput={(params) => {
                                return (
                                    <TextField key={FilterItems[3].keyui} color='neutral' {...params} label={FilterItems[3].text} size='medium'
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {/* {loadingAPI ? <CircularProgress color="inherit" size={20} /> : null} */}
                                                    {FilterItems[3].load ? <Box sx={{ width: '100%' }}>
                                                        <LinearProgress color="inherit" />
                                                    </Box> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }} />
                                )
                            }}
                            onChange={(event, newValue) => setSelectedOption4(newValue as newCategoria | null)}

                        />
                    </ListItemText>
                </ListItem>
                {/* {selectedOption4 && <p>El ID seleccionado es actual: {selectedOption4.id}</p>} */}
            </Grid>


            {/* 
            <p> / {selectedOption1?.id} / and / {selectedOption1?.name} / ◄☼► </p><br />
            <p> / {selectedOption2?.id} / and / {selectedOption2?.name} / ◄☼► </p><br />
            <p> / {selectedOption3?.id} / and / {selectedOption3?.name} / ◄☼► </p><br />
            <p> / {selectedOption4?.id} / and / {selectedOption4?.name} /  </p><br /> */}
        </Grid>
    )
};

