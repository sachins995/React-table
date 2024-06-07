// import DataTable from "./DataTable"
import "./App.css"
import CompleteData from "./Data.json"
import {MaterialReactTable,useMaterialReactTable} from "material-react-table"
import { useMemo ,useState} from "react"
import { IconButton, Drawer } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function App() {
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const columns = useMemo(()=>[
{
  accessorKey:"id",
  header : "ID",
  size: 50
},
{
  accessorKey:"name",
  header : "Name",
  size: 150
},
{
  accessorKey:"category",
  header : "Category",
  size: 100
},
{
  accessorKey:"subcategory",
  header : "Subcategory",
  size: 120
},
{
  accessorKey:"createdAt",
  header : "Created At",
  size: 200
},
{
  accessorKey:"updatedAt",
  header : "Updated At",
  size: 200
},
{
  accessorKey:"price",
  header : "Price",
  size: 80,
  
    // accessorKey: 'salary',
    // header: 'Salary',
    Cell: ({ cell }) =>
      cell.getValue().toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive', // default (or between)
    muiFilterSliderProps: {
      marks: true,
      max: 100, //custom max (as opposed to faceted max)
      min: 10, //custom min (as opposed to faceted min)
      step: 10,
      valueLabelFormat: (value) =>
        value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
    },
},
{
  accessorKey:"sale_price",
  header : "Sale Price",
  size: 100
}

],[]);
const table = useMaterialReactTable({
  columns,
  data: CompleteData,
  initialState:{pagination:{pageSize:10,pageIndex:0}},
  enableColumnResizing: true,
  // enableRowNumbers:true,
  rowNumberDisplayMode:"original",
  enableStickyHeader:true,
  enableStickyFooter:true,
  paginationDisplayMode: "pages",
  enableColumnActions: false,
  manualPagination: false,
  enableGlobalFilter:true,
  showGlobalFilter:true
 
})
  return (
    <>
    <h1>Hii</h1>
 
    <IconButton
        onClick={() => setIsDrawerOpen(true)}
        sx={{ position: 'relative', top: 16, right: 16 }}
      >
        <FilterAltIcon />
      </IconButton>
      {/* </MaterialReactTable> */}
      <Drawer
        anchor='right'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div style={{ width: 250, padding: 16 }}>
          <h3>Filters</h3>
          {/* Add your filter controls here */}
          {/* Example for a name filter */}
          <div>
            <label>Name</label>
            <input type="text" onChange={(e) => {
              table.setColumnFilterValue('name', e.target.value);
            }} />
          </div>
          {/* Add more filters as needed */}
        </div>
      </Drawer>
      <MaterialReactTable table = {table}/>
      </>
  )
}

export default App

