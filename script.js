const puntosReferencia = {
    "Plaza de Armas": { coords: [-16.409, -71.5372], precio: 7 },
    "Catedral de Arequipa": { coords: [-16.4091, -71.5377], precio: 8 },
    "Monasterio de Santa Catalina": { coords: [-16.3981, -71.5379], precio: 9 },
    "Mirador de Yanahuara": { coords: [-16.3973, -71.5301], precio: 10 },
    "Volcán Misti": { coords: [-16.1651, -71.5833], precio: 11 },
    "Museo Santuarios Andinos": { coords: [-16.3984, -71.5374], precio: 12 },
    "Convento de La Recoleta": { coords: [-16.3948, -71.5316], precio: 13 },
    "Molino de Sabandía": { coords: [-16.3078, -71.6078], precio: 14 },
    "Cañón del Colca": { coords: [-15.6132, -71.6079], precio: 15 },
    "Iglesia de la Compañía": { coords: [-16.3954, -71.5375], precio: 16 }
};

// Nuevas coordenadas de Pollería PPS Chicken
const ppsChickenCoords = [-16.424104258251806, -71.52208646640479]; // Coordenadas actualizadas

async function buscarPuntoReferencia() {
    const direccion = document.getElementById("direccion").value;
    const resultadoDiv = document.getElementById("resultado");

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion + ', Arequipa, Perú')}&format=json&addressdetails=1`);
        const data = await response.json();

        if (data.length === 0) {
            resultadoDiv.innerHTML = "Dirección no encontrada.";
            return;
        }

        const usuarioCoordenadas = [data[0].lat, data[0].lon];

        let puntoCercano = null;
        let distanciaCercana = Infinity;
        let precioCercano = 0;

        // Calcular distancia a los puntos de referencia
        for (const [punto, info] of Object.entries(puntosReferencia)) {
            const distancia = calcularDistancia(usuarioCoordenadas, info.coords);
            if (distancia < distanciaCercana) {
                distanciaCercana = distancia;
                puntoCercano = punto;
                precioCercano = info.precio; // Obtener el precio del punto cercano
            }
        }

        // Calcular distancia a Pollería PPS Chicken
        const distanciaPpsChicken = calcularDistancia(usuarioCoordenadas, ppsChickenCoords);

        // Crear enlaces a Google Maps
        const enlaceReferencia = `https://www.google.com/maps/dir/?api=1&origin=${usuarioCoordenadas[0]},${usuarioCoordenadas[1]}&destination=${puntosReferencia[puntoCercano].coords[0]},${puntosReferencia[puntoCercano].coords[1]}&travelmode=driving`;
        const enlacePpsChicken = `https://www.google.com/maps/dir/?api=1&origin=${usuarioCoordenadas[0]},${usuarioCoordenadas[1]}&destination=${ppsChickenCoords[0]},${ppsChickenCoords[1]}&travelmode=driving`;

        // Mostrar resultado
        resultadoDiv.innerHTML = `
            El punto de referencia más cercano es <strong>${puntoCercano}</strong> 
            a <strong>${distanciaCercana.toFixed(2)} km</strong> 
            con un costo de recarga de <strong>${precioCercano} soles</strong>.<br>
            La distancia a Pollería PPS Chicken es <strong>${distanciaPpsChicken.toFixed(2)} km</strong>.<br>
            <a href="${enlaceReferencia}" target="_blank">Ver ruta a ${puntoCercano} en Google Maps</a><br>
            <a href="${enlacePpsChicken}" target="_blank">Ver ruta a Pollería PPS Chicken en Google Maps</a>
        `;
    } catch (error) {
        resultadoDiv.innerHTML = "Error al buscar la dirección.";
        console.error(error);
    }
}

function calcularDistancia(coord1, coord2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}
