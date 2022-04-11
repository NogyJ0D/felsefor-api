const stripe = Stripe('pk_test_51KifweI1XgjcsrLOZMzZ9X9QAdCbMkOVyYQJ7Ju3pTQwLdOagU8phWIntq6MSoc3vubNM7eZep1yKGF7Rq2yLIEs00H0b8h7ha')

const form = document.getElementById('payment-form')

let elements

const iniciar = async () => {
  const response = await window.fetch('/payments/intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 100000 })
  })
  const { clientSecret } = await response.json()

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#ffb10a',
      colorBackground: '#171717'
    }
  }
  elements = stripe.elements({ appearance, clientSecret })

  const paymentElement = elements.create('payment')
  paymentElement.mount('#payment-element')
}

const handleSubmit = async e => {
  e.preventDefault()

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: 'http://localhost:4000'
    }
  })
}

iniciar()
form.addEventListener('submit', handleSubmit)
