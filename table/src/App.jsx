import "./App.css";
import moment from "moment"
import CompleteData from "./Data.json";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useMemo, useState } from "react";
import { IconButton, Drawer, TextField, Slider, Box, Button, MenuItem, Select, FormControl, InputLabel, List,ListItem,ListItemButton,ListItemText, Stack, Radio,
  RadioGroup } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const [groupedColumnMode, setGroupedColumnMode] = useState('reorder');
  const [sortBy, setSortBy] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    category: [],
    subcategory: "",
    // dayjs().subtract(1, 'year'), dayjs()
    createdAt: [null,null],
    updatedAt: [null,null],
    price: [10, 100],
    sale_price: [10, 100]
  });
  const columns = useMemo(() => [
    { accessorKey: "id", header: "ID", size: 50 },
    { accessorKey: "name", header: "Name", size: 150 },
    { accessorKey: "category", header: "Category", size: 100 , filterVariant: 'multi-select'},
    { accessorKey: "subcategory", header: "Subcategory", size: 120 },
    {
      accessorKey: "createdAt",
      header: "Created At",
      size: 200,
      Cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YYYY HH:mm")
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      size: 200,
      Cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YYYY HH:mm")
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 80,
      Cell: ({ cell }) =>
        cell.getValue().toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        })
    },
    {
      accessorKey: "sale_price",
      header: "Sale Price",
      size: 100,
      Cell: ({ cell }) =>
        cell.getValue().toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        })
    }
  ], []);

  const subcategories = [
    "Biking", "Camping", "Fitness", "Outdoors", "Sports", "Swimming",
    "Car", "Engine", "Tire", "Bath", "Makeup", "Skin Care", "Baby",
    "Jewelry", "Kids", "Mens", "Womens", "Camera", "Computer", "Phone",
    "Technology", "Book", "Game", "Movie", "Music", "Party", "Toy",
    "First Aid", "Medicine", "Nutrition", "Vitamin", "Bedding", "Cleaning",
    "Dining", "Furniture", "Home Improvement", "Kitchen", "Storage",
    "Aquarium", "Cat", "Dog"
  ];

  const filteredData = useMemo(() => {
    return CompleteData.filter(row => {
      const createdAt = dayjs(row.createdAt);
      const updatedAt = dayjs(row.updatedAt);
      return (
        row.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        // row.category.toLowerCase().includes(filters.category.toLowerCase()) &&
        // row.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase()) &&
        (filters.category.length === 0 || filters.category.some(cat => row.category.toLowerCase().includes(cat.toLowerCase()))) &&
        row.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase()) &&
        row.price >= filters.price[0] &&
        row.price <= filters.price[1] &&
        row.sale_price >= filters.sale_price[0] &&
        row.sale_price <= filters.sale_price[1] &&
        createdAt.isBetween(filters.createdAt[0], filters.createdAt[1], null, '[]') &&
        updatedAt.isBetween(filters.updatedAt[0], filters.updatedAt[1], null, '[]')
      );
    });
  }, [filters]);

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    // initialState: {  },
    enableColumnResizing: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableFacetedValues: true,
    paginationDisplayMode: "pages",
    enableColumnActions: false,
    manualPagination: false,
    enableGlobalFilter: true,
    showGlobalFilter: true,
    enableGrouping: true,
    groupedColumnMode,
    initialState: {
      // sorting: sortBy,
      // expanded: true, //expand all groups by default
      // grouping: [""], //an array of columns to group by by default (can be multiple)
      pagination: { pageSize: 10, pageIndex: 0 },
    },
    muiTableContainerProps: { sx: { maxHeight: '800px' } },
    enableColumnVisibility: false,
    sorting: {
      sortBy,
    },
    muiTableToolbarTop: ({ table }) => (
      <Box display="flex" justifyContent="flex-end" alignItems="center" width="100%">
         <div>{table.getGlobalFilter()}</div>
        <IconButton
          onClick={() => setIsDrawerOpen(true)}
          // sx={{ marginLeft: 'auto' }}
        >
          <FilterAltIcon />
        </IconButton>
      </Box>
    ),
    enableSorting: true,
    state: { sorting: sortBy },
    onSortingChange: setSortBy,
  });

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: Array.isArray(value) ? value : [value],
    });
  };

  const clearFilters = () => {
    console.log("Entered filter")
    setFilters({
      name: "",
      category: [],
      subcategory: "",
      // dayjs().subtract(1, 'year'), dayjs()
      createdAt: [null,null],
      // dayjs().subtract(1, 'year'), dayjs()
      updatedAt: [null,null],
      price: [10, 100],
      sale_price: [10, 100]
    });
  };

  const handleSortChange = (column) => {
    console.log("Button Clicked")
    const newSortBy =  [...sortBy] ;
    const sortIndex = newSortBy.findIndex((sortItem) => sortItem.id === column.accessorKey);
    if (sortIndex !== -1) {
      // Toggle sorting direction
      newSortBy[sortIndex].desc = !newSortBy[sortIndex].desc;
    } else {
      // Add new sorting configuration
      newSortBy.push({ id: column.accessorKey, desc: false });
    }
    setSortBy(newSortBy);
    setIsSortDrawerOpen(false); // Close the drawer after selecting a column to sort
  };
  const handleClearFilters = () => {
    setSortBy([]);
  };


  return (
    // <div>
       <div className="table-container">
        {/* <Stack gap="1rem">
      <DemoRadioGroup
        groupedColumnMode={groupedColumnMode}
        setGroupedColumnMode={setGroupedColumnMode}
      />
      <MaterialReactTable table={table} />
    </Stack> */}
      
      {/* </div> */}
    
      <IconButton
        onClick={() => setIsDrawerOpen(true)}
        sx={{ position: "relative", top: 16, right: 16 }}
      >
        <FilterAltIcon />
      </IconButton>
      {/* <Button type="submit" onClick ={()=>setIsSortDrawerOpen(true)}>Sort</Button> */}
      <Box>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button variant="contained" startIcon={<SortIcon />} onClick={() => setIsSortDrawerOpen(true)}>
        </Button>
      </Box>
      <Drawer anchor="right" open={isSortDrawerOpen} onClose={() => setIsSortDrawerOpen(false)}>
        <div style={{ width: 250, padding: 16 }}>
          <h3>Sort By</h3>
          <List>
            {columns.map((column) => (
              <ListItem key={column.accessorKey}>
                <ListItemButton onClick={() => handleSortChange(column)}>
                  <ListItemText primary={column.header} />
                </ListItemButton>
              </ListItem>
            ))}
            <Button type="button" onClick={()=>handleClearFilters()}>Clear Sort</Button>
          </List>
        </div>
      </Drawer>
      </Box>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div style={{ width: 250, padding: 16 }}>
          <h3>Filters</h3>
          <div>
            {/* <label>Name</label> */}
           
            <TextField
             placeholder = "Name"
              fullWidth
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem  className="dropdown" value=""><em>None</em></MenuItem>
                <MenuItem value="Activity">Activity</MenuItem>
                <MenuItem value="Automotive">Automotive</MenuItem>
                <MenuItem value="Beauty">Beauty</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Health">Health</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Pets">Pets</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={filters.subcategory}
                onChange={(e) => handleFilterChange("subcategory", e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory} value={subcategory}>{subcategory}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="created-at">
            <label className="create">Created At</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                className="calendor"
                value={filters.createdAt[0]}
                onChange={(newValue) => handleFilterChange("createdAt", [newValue, filters.createdAt[1]])}
              />
              <DatePicker
                label="End Date"
                className="calendor"
                value={filters.createdAt[1]}
                onChange={(newValue) => handleFilterChange("createdAt", [filters.createdAt[0], newValue])}
              />
            </LocalizationProvider>
          </div>
          <div>
            <label className="create">Updated At</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                className="calendor"
                value={filters.updatedAt[0]}
                onChange={(newValue) => handleFilterChange("updatedAt", [newValue, filters.updatedAt[1]])}
              />
              <DatePicker
                label="End Date"
                className="calendor"
                value={filters.updatedAt[1]}
                onChange={(newValue) => handleFilterChange("updatedAt", [filters.updatedAt[0], newValue])}
              />
            </LocalizationProvider>
          </div>
          <div>
            <label>Price</label>
            <Slider
              value={filters.price}
              onChange={(e, value) => handleFilterChange("price", value)}
              valueLabelDisplay="auto"
              marks
              min={10}
              max={100}
              step={10}
            />
          </div>
          <div>
            <label>Sale Price</label>
            <Slider
              value={filters.sale_price}
              onChange={(e, value) => handleFilterChange("sale_price", value)}
              valueLabelDisplay="auto"
              marks
              min={10}
              max={100}
              step={10}
            />
          </div>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={()=>clearFilters()}>
              Clear Filters
            </Button>
          </Box>
        </div>
      </Drawer>
      
      <MaterialReactTable table={table} />
    </div>
  );
}



export default App;
