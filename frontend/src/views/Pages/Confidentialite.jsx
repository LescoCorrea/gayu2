
import { Link } from "react-router-dom";
import TopNav from './Components/Topnav';
import Footer from './Components/Footer';
import Contacts from './Components/Contacts';

export default function Confidentialite() {
    return (
        <div>
            <div className='mt-3'>
                <TopNav />
                <div className="container mt-5">
                    <ul className="breadcrumb">
                        <li className='breadcumbs'><Link to="/" className='lnk'>Accueil /</Link></li>
                        <li className='breadcumbs'>Confidentialite</li>
                    </ul>
                    <div>
                        <h1 className='title-propos'>Confidentialite</h1>
                    </div>
                    <div className="row mt-5">
                        <div>
                            <h4>*Politique de Confidentialité*</h4>
                            <h6>Dernière mise à jour : 01 / 01 / 2024</h6>
                            <p>
                                Bienvenue sur GAYU, une plateforme en ligne dédiée à la mise en relation des artisans et des clients au Sénégal. Nous nous engageons à protéger et à respecter votre vie privée. Cette politique de confidentialité décrit comment nous recueillons,
                             utilisons, partageons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme.
                            </p>
                        </div>
                        <div>
                            <h4>1. Collecte des Informations</h4>
                            <p>Nous recueillons différents types d&apos;informations pour vous fournir et améliorer notre service.</p>
                            <h6>1.1. Informations que vous nous fournissez :</h6>
                            <p>- Informations personnelles : Lorsque vous créez un compte, nous collectons des informations telles que votre
                                 nom, adresse e-mail, numéro de téléphone, et autres informations nécessaires pour vous identifier.</p>
                            <p>- Informations sur les artisans : Si vous êtes un artisan, nous collectons des informations sur vos compétences, expériences, tarifs, disponibilité, et autres détails pertinents.</p>
                            <p>- Données de transaction : Détails concernant les réservations, paiements, et autres transactions effectuées sur la plateforme.</p>
                        </div>
                        <div>
                            <h4>1.2. Informations collectées automatiquement :</h4>
                            <p>
                            - Données de navigation : Lorsque vous utilisez la plateforme, nous pouvons collecter des informations sur votre activité, telles que l&apos;adresse IP, le type de navigateur, les pages visitées, et le temps passé sur la plateforme.
                            </p>
                            <p>- Cookies et technologies similaires : Nous utilisons des cookies pour collecter des informations et améliorer votre expérience utilisateur. Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.</p>
                        </div>
                        <div>
                            <h4>2. Utilisation des Informations</h4>
                            <h6>Nous utilisons les informations que nous collectons pour :</h6>
                            <p>- Fournir, exploiter, et améliorer notre plateforme ;</p>
                            <p>- Faciliter la recherche et la réservation de services d&apos;artisans ;</p>
                            <p>- Communiquer avec vous, répondre à vos demandes, et vous fournir un support client ;</p>
                            <p>- Personnaliser votre expérience sur la plateforme ;</p>
                            <p>- Gérer les transactions et les paiements ;</p>
                            <p>- Envoyer des notifications importantes, telles que des mises à jour sur nos services ou des changements dans nos politiques ;</p>
                            <p>- Assurer la sécurité de notre plateforme et prévenir la fraude.</p>
                        </div>
                        <div>
                            <h4>3. Partage des Informations</h4>
                            <h6>Nous ne partageons vos informations personnelles qu&apos;avec votre consentement ou dans les circonstances suivantes :</h6>
                            <p>
                            - Avec les artisans : Pour faciliter la réservation de services, nous partageons vos informations avec les artisans que vous choisissez d&apos;engager.
                            </p>
                            <p>
                            - Avec des prestataires de services : Nous pouvons partager des informations avec des tiers qui fournissent des services en notre nom, tels que le traitement des paiements, l&apos;hébergement de la plateforme, et le marketing.
                            </p>
                            <p>
                            - Conformité légale : Nous pouvons divulguer vos informations si cela est nécessaire pour se conformer à la loi, répondre à une procédure judiciaire, ou protéger nos droits et intérêts.
                            </p>
                            <p>
                            - Dans le cadre d&apos;une fusion ou acquisition : En cas de fusion, acquisition ou vente d&apos;actifs, vos informations pourraient être transférées à une nouvelle entité.
                            </p>
                            
                        </div>
                        <div>
                            <h4>
                                4. Sécurité des Informations
                            </h4>
                            <h6>
                            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l’accès non autorisé, la modification, la divulgation ou la destruction. Cependant, aucun système de sécurité n’est infaillible, et nous ne pouvons garantir la sécurité absolue des informations transmises sur notre plateforme.
                            </h6>
                        </div>
                        <div>
                            <h4>5. Vos Droits</h4>
                            <p>
                            Vous avez le droit de :
                            </p>
                            <p>
                            - Accéder à vos informations personnelles que nous détenons ;
                            </p>
                            <p>
                            - Demander la correction de vos informations inexactes ou incomplètes ;
                            </p>
                            <p>
                            - Demander la suppression de vos informations personnelles, sous réserve de certaines exceptions ;
                            </p>
                            <p>
                            - Demander la suppression de vos informations personnelles, sous réserve de certaines exceptions ;
                            </p>
                            <p>
                            - Vous opposer au traitement de vos informations personnelles ;
                            </p>
                            <p>
                            - Demander la portabilité de vos informations personnelles.
                            </p>
                        </div>
                        <div>
                            <h6>Pour exercer ces droits, veuillez nous contacter à l’adresse suivante : gayu@gmail.com.</h6>
                        </div>
                        <div>
                            <h4>6. Conservation des Informations</h4>
                            <h6>Nous conservons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette politique de confidentialité, sauf si une période de conservation plus longue est requise ou permise par la loi.</h6>
                        </div>
                        <div>
                            <h4>7. Modifications de la Politique de Confidentialité</h4>
                            <h6>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette politique pour rester informé des modifications.</h6>
                        </div>
                        <div>
                            <h4>8. Contact</h4>
                            <h6>Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité, veuillez nous contacter à :</h6>
                        </div>
                        <div>
                            <h5>GAYU</h5>
                            <h5>Parcelles-Assainies U15</h5>
                            <h5>Gayu@gmail.com</h5>
                            <h5>+221 77 486 48 08</h5>
                        </div>
                    </div>

                    <div className='cont-prop'>
                        <Contacts />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}
