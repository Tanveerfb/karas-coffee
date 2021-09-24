import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { Product, Customer, Session, Review, Subscription, Content } from '../types';

export const productConverter: FirestoreDataConverter<Product> = {
  fromFirestore(snapshot): Product {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      name: data.name || '',
      role: data.role,
      tax_code: data.tax_code,
      active: !!data.active,
      description: data.description || '',
      images: data.images || [],
      metadata: {
        type: data.metadata?.type ?? '',
        origin: data.metadata?.origin ?? '',
        strength: data.metadata?.strength ?? '',
        variety: data.metadata?.variety ?? '',
        price: data.metadata?.price ?? '',
        price_usd: data.metadata?.price_usd ?? '',
        weight: data.metadata?.weight ?? '0g'
      },
    };
  },
  toFirestore() {
    throw new Error('Client does not support updating products.');
  },
};

export const reviewConverter: FirestoreDataConverter<Review> = {
  fromFirestore(snapshot): Review {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      created_at: (data.created_at as Timestamp).toDate(),
      product_id: data.product_id,
      rating: data.rating ?? 0,
      message: data.message ?? '',
      user: {
        id: data.user.id,
        display_name: data.user.display_name,
        photo_url: data.user.photo_url,
      },
      attribute_scores: data.attribute_scores,
    };
  },
  toFirestore(review: Review) {
    return {
      created_at: review.created_at,
      product_id: review.product_id,
      rating: review.rating ?? 0,
      message: review.message ?? '',
      user: {
        id: review.user.id,
        display_name: review.user.display_name,
        photo_url: review.user.photo_url,
      },
    };
  },
};

export const customerConverter: FirestoreDataConverter<Customer> = {
  fromFirestore(snapshot): Customer {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      stripe_id: data.stripeId,
    };
  },
  toFirestore(): Customer {
    throw new Error('Client does not support updating customers.');
  },
};

export const sessionConverter: FirestoreDataConverter<Session> = {
  fromFirestore(snapshot): Session {
    const data = snapshot.data();

    return {
      mode: data.mode,
      success_url: data.success_url,
      cancel_url: data.cancel_url,
      customer: data.customer,
      price: data.price,
      line_items: data.line_items || [],
      shipping: data.shipping || {},
      url: data.url,
      collect_shipping_address: data.collect_shipping_address,
      error: data.error,
    };
  },
  toFirestore(session: Session) {
    return {
      mode: session.mode,
      success_url: session.success_url,
      cancel_url: session.cancel_url,
      customer: session.customer,
      // price: session.price,
      line_items: session.line_items || [],
      shipping: session.shipping || {},
      collect_shipping_address: session.collect_shipping_address,
      metadata: {
        mode: session.mode,
        carrierId: session.shipment?.carrierId,
        serviceCode: session.shipment?.serviceCode,
        shipDate: session.shipment?.shipDate,
        shipFromName: session.shipment?.shipFrom.name,
        shipFromPhone: session.shipment?.shipFrom.phone,
        shipFromAddressLine1: session.shipment?.shipFrom.addressLine1,
        shipFromCityLocality: session.shipment?.shipFrom.cityLocality,
        shipFromStateProvince: session.shipment?.shipFrom.stateProvince,
        shipFromPostalCode: session.shipment?.shipFrom.postalCode,
        shipFromCountryCode: session.shipment?.shipFrom.countryCode,
        shipToName: session.shipment?.shipTo.name,
        shipToAddressLine1: session.shipment?.shipTo.addressLine1,
        shipToAddressLine2: session.shipment?.shipTo.addressLine2,
        shipToCityLocality: session.shipment?.shipTo.cityLocality,
        shipToStateProvince: session.shipment?.shipTo.stateProvince,
        shipToPostalCode: session.shipment?.shipTo.postalCode,
        shipToCountryCode: session.shipment?.shipTo.countryCode,
        packageWeightValue: session.shipment?.packages[0].weight.value,
        packageWeightUnit: session.shipment?.packages[0].weight.unit,
      },
    };
  },
};

export const subscriptionConverter: FirestoreDataConverter<Subscription> = {
  fromFirestore(snapshot): Subscription {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      ...data,
      status: data.status,
    };
  },
  toFirestore(subscription: Subscription) {
    throw new Error('Client does not support updating subscriptions.');
  },
};

export const contentConverter: FirestoreDataConverter<Content> = {
  fromFirestore(snapshot): Content {
    const data = snapshot.data();

    return {
      id: data.id,
      title: data.title,
      hero: data.hero,
      excerpt: data.excerpt,
      created_at: data.created_at,
      content: data.content,
    };
  },
  toFirestore() {
    throw new Error('Client does not support updating content.');
  },
};
