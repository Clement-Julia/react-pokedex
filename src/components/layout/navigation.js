import { Link } from 'react-router-dom'

export default function Navigation() {
	return (
		<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			<div className='container-fluid'>
				<button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarSupportedContent'>
					<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
						<li className='nav-item'>
							<Link className='nav-link' to='/'>
								Accueil
							</Link>
						</li>
					</ul>
					<form className='d-flex' method='GET' action='?'>
						<input id="search" className='form-control me-2' type='search' placeholder='Rechercher' aria-label='Rechercher' name="query" />
						<button className='btn btn-outline-success' type='submit'>
							<i className="fa-solid fa-magnifying-glass"></i>
						</button>
					</form>
				</div>
			</div>
		</nav>
	)
}
