import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  IconButton,
  TextField,
  Typography,
  Box
} from '@mui/material'

type ProductType = 'food' | 'card' | 'gift'

type FoodProduct = {
  productId: number
  description: string
  prId: number
  qoh: number
  srate: number
  mrp: number
  upcBarcode: string
  tax: string
  taxType: string
  taxPer: string
}

type CardProduct = {
  product_id: number
  product: string
  suggestedPrice: number
  cashBalance: number
  cashBonusBalnce: number
  tokenBalnce: number
  points: number
}

type GiftProduct = {
  productId: number
  description: string
  prId: number
  qoh: number
  srate: number
  mrp: number
  upcBarcode: string
  tax: string
  taxType: string
  taxPer: string
}

type Product = FoodProduct | CardProduct | GiftProduct

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  productType: ProductType
  products: Product[]
  defaultValues?: any
}

export default function ProductSelectionModal({
  open,
  onClose,
  onSubmit,
  productType,
  products = [],
  defaultValues
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [price, setPrice] = useState<number>(0)

  useEffect(() => {
    if (defaultValues) {
      // Find the product that matches the default values
      const product = products.find(p => {
        if ('description' in p) {
          return p.description === defaultValues.product
        }

        if ('product' in p) {
          return p.product === defaultValues.product
        }

        return false
      })
      
      setSelectedProduct(product || null)
      setQuantity(defaultValues.quantity || 1)
      setPrice(defaultValues.price || 0)
    } else {
      resetForm()
    }
  }, [defaultValues, products, open])

  const resetForm = () => {
    setSelectedProduct(null)
    setQuantity(1)
    setPrice(0)
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)

    // Set price based on product type
    if ('srate' in product) {
      setPrice(product.srate)
    } else if ('suggestedPrice' in product) {
      setPrice(product.suggestedPrice)
    }
  }

  const handleSubmit = () => {
    if (!selectedProduct) return

    const productName = 'description' in selectedProduct 
      ? selectedProduct.description 
      : 'product' in selectedProduct 
      ? selectedProduct.product 
      : ''

    const data = {
      id: defaultValues?.id || Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
      product: productName,
      price,
      quantity
    }

    onSubmit(data)
    resetForm()
    onClose()
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  const renderTableHeaders = () => {
    if (productType === 'food' || productType === 'gift') {
      return (
        <TableRow>
          <TableCell padding="checkbox"></TableCell>
          <TableCell>Description</TableCell>
          <TableCell align="right">Stock (QoH)</TableCell>
          <TableCell align="right">Price (srate)</TableCell>
          <TableCell align="right">MRP</TableCell>
          <TableCell>Tax Type</TableCell>
          <TableCell align="right">Tax %</TableCell>
          <TableCell>Barcode</TableCell>
        </TableRow>
      )
    } else if (productType === 'card') {
      return (
        <TableRow>
          <TableCell padding="checkbox"></TableCell>
          <TableCell>Product</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell align="right">Cash Balance</TableCell>
          <TableCell align="right">Bonus Balance</TableCell>
          <TableCell align="right">Token Balance</TableCell>
          <TableCell align="right">Points</TableCell>
        </TableRow>
      )
    }
  }

  const renderTableRow = (product: Product, index: number) => {
    const isSelected = selectedProduct === product

    if (productType === 'food' || productType === 'gift') {
      const p = product as FoodProduct | GiftProduct

      return (
        <TableRow
          key={index}
          hover
          onClick={() => handleProductSelect(product)}
          selected={isSelected}
          sx={{ cursor: 'pointer' }}
        >
          <TableCell padding="checkbox">
            <Radio checked={isSelected} />
          </TableCell>
          <TableCell>{p.description}</TableCell>
          <TableCell align="right">{p.qoh}</TableCell>
          <TableCell align="right">₹{p.srate}</TableCell>
          <TableCell align="right">₹{p.mrp}</TableCell>
          <TableCell>{p.taxType}</TableCell>
          <TableCell align="right">{p.taxPer}%</TableCell>
          <TableCell>{p.upcBarcode || '-'}</TableCell>
        </TableRow>
      )
    } else if (productType === 'card') {
      const p = product as CardProduct

      return (
        <TableRow
          key={index}
          hover
          onClick={() => handleProductSelect(product)}
          selected={isSelected}
          sx={{ cursor: 'pointer' }}
        >
          <TableCell padding="checkbox">
            <Radio checked={isSelected} />
          </TableCell>
          <TableCell>{p.product}</TableCell>
          <TableCell align="right">₹{p.suggestedPrice}</TableCell>
          <TableCell align="right">₹{p.cashBalance}</TableCell>
          <TableCell align="right">₹{p.cashBonusBalnce}</TableCell>
          <TableCell align="right">{p.tokenBalnce}</TableCell>
          <TableCell align="right">{p.points}</TableCell>
        </TableRow>
      )
    }
  }

  const getTitle = () => {
    const action = defaultValues ? 'Edit' : 'Add'
    const type = productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Item'

    return `${action} ${type}`
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{getTitle()}</Typography>
          <IconButton onClick={handleCancel} size="small">
            <i className="tabler-x" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Product
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                {renderTableHeaders()}
              </TableHead>
              <TableBody>
                {products.map((product, index) => renderTableRow(product, index))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {selectedProduct && (
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              inputProps={{
                min: 1,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                onWheel: (e) => (e.currentTarget as HTMLInputElement).blur(),
                className: 'no-spinner'
              }}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              inputProps={{
                min: 0,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                onWheel: (e) => (e.currentTarget as HTMLInputElement).blur(),
                className: 'no-spinner'
              }}
              fullWidth
            />
            <TextField
              label="Total"
              value={`₹${(quantity * price).toFixed(2)}`}
              InputProps={{
                readOnly: true
              }}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} variant="tonal" color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!selectedProduct || quantity < 1}
        >
          {defaultValues ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
