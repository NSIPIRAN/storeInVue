app.component("product", { 
  template: /* vue-html */`
    <section class="product">
      <div class="product__thumbnails">
          <div class="thumb" 
          v-for="(image, index) in product.images"
          :key="image.thumbnail"
          :class=" {active: activeImage == index}" 
          :style="{ backgroundImage: 'url('+ product.images[index].thumbnail +')' }"
          @click="activeImage = index"
          ></div>
      </div>
      <div class="product__image">
          <img  :src="product.images[activeImage].image" :alt="product.name" />
      </div>
    </section>
    <section class="description">
      <h4>{{ product.name.toUpperCase() }}{{ product.stock === 0 ? " 😥" : "😍"}}</h4>
      <span v-if="product.new" class="badge new">Nuevo</span>
      <span v-if="product.offer" class="badge offer">Oferta</span>
      <p class="description__status" v-if="product.stock < 4 && product.stock > 0">Ya quedan pocos productos</p>
      <p class="description__status" v-else-if="product.stock == 0">Producto agotado</p>
      <p class="description__price" :style="{ color: price_color}">$ {{ product.price }}</p>
      <p class="description__content">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, facere quis animi, amet sequi iste ipsam rerum, necessitatibus tempora obcaecati consequatur maxime sint eos laboriosam veniam maiores voluptatem eum! Eveniet!</p>
      <div class="discount"> 
          <span>Código de Descuento</span>
          <input 
            type="text" 
            placeholder="Ingresa tu código" 
            @keyup.enter="applyDiscount($event)"
          />
      </div>
      <button 
        :disabled="product.stock==0" 
        @click="sendToCart()"
        >
        Agregar al carrito
      </button>
    </section>
  `,
  props: ["product"],
  emits: ["sendtocart"],
  setup(props, context){
    const productState = reactive({
      activeImage: 0,
      //price_color: "rgb(104, 104, 209)"
      price_color: computed(() => 
      props.product.stock <= 1 ? "rgb(188, 30, 67)" : "rgb(104, 104, 209)"
      ),

    });
    
    const discountCodes = ref(["nath","zipm"]);

    function applyDiscount(event){
      //se debe usar value para acceder a la referencia
      discountCodeIndex = discountCodes.value.indexOf(event.target.value);
      if (discountCodeIndex >= 0) {
        props.product.price *= 50/100;
        discountCodes.value.splice(discountCodeIndex, 1)
      }
    } 

    function sendToCart(){
      context.emit("sendtocart", props.product)
    }
// para cuando no sea una ref y sea un reactive ejemplo se usa ()=>
    watch(
      () => productState.activeImage, 
      (val, oldValue) => {
          console.log(val, oldValue);
      }
    );

   /*  watch(
      () => props.product.stock,
      (stock) => {
          if (stock <= 1) {
              productState.price_color = "rgb(188, 30, 67)";
          }
      }

    ); */
    return {
      ...toRefs(productState),
     
      applyDiscount,
      sendToCart

    };
  }
});

