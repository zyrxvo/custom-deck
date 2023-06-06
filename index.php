<!-- Garett Brown May 2023 Custom-Deck Main Page  -->
<?php require "php/main.php"; 
$config = loadConfig("config.json");
?>
<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<head>
	<link rel="stylesheet" href="main.css">
	<link rel="icon" href="images/favicon.ico">
	<title customdeck-placeholder="site.title" ><?php echo $config["site"]["title"]; ?></title>
</head>
<body class="page">
<script src="js/main.js"></script>
	<section class="card-hero">
		<img customdeck-placeholder="homepage.heroimage" alt="Hero Image" src=<?php echo $config["homepage"]["heroimage"]; ?> >
		<div class="hero-text">
			<h1 customdeck-placeholder="homepage.herotext"><?php echo $config["homepage"]["herotext"];?></h1>
			<h4 customdeck-placeholder="homepage.heroquote"><?php echo $config["homepage"]["heroquote"]; ?></h4>
		</div>
		<div class="hero-text-small">
			<h3 customdeck-placeholder="homepage.herotext"><?php echo $config["homepage"]["herotext"]; ?></h3>
			<h6 customdeck-placeholder="homepage.heroquote"><?php echo $config["homepage"]["heroquote"]; ?></h6>
		</div>
	</section>

	<!-- <div customdeck-include-html="nav.html"></div> -->
	<?php $PAGE="home"; require "nav.php"; ?>
	<section class="card padded margins">
		<div id="readme" class="twothirds">
			<?php insertMD("README.md"); ?>
			<!-- <script>insertMD("README.md", "readme");</script> -->
		</div>
		<div class="onethird">
			<img src="homepage/images/cards.jpeg" alt="Deck of Cards" >
		</div>
	</section>

	<section class="card color1 padded margins">
		<div class="half">
			<div id="customization" class="card color2 padded">
				<?php insertMD("homepage/customization.md"); ?>
				<!-- <script>insertMD("homepage/customization.md", "customization");</script> -->
			</div>
		</div>
		<div class="half">
			<div id="implementation" class="card color3 padded">
				<?php insertMD("homepage/implementation-details.md"); ?>
				<!-- <script>insertMD("homepage/implementation-details.md", "implementation");</script> -->
			</div>
		</div>
	</section>

	<section class="card color1 padded margins">
		<div class="onethird">
			<img src="homepage/images/landscape.jpeg" alt="Landscape" >
		</div>
		<div id="markdown-example" class="twothirds">
			<?php insertMD("homepage/markdown-example.md"); ?>
			<!-- <script>insertMD("homepage/markdown-example.md", "markdown-example");</script> -->
		</div>
	</section>
	<?php require "footer.html"; ?>
	<!-- <section class="footer" customdeck-include-html="footer.html"></section> -->
	<!-- <script> includeHTML("home").then(() => { loadConfig(); updateNavLinks(); setScene(); }); </script> -->
</body>
</html>
