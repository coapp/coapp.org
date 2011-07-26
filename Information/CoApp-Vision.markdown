---
#
# use this template for sub-pages in the information tab 
# make sure that you put the same title in the _layouts/information.layout file 
#
layout: information
subtitle: CoApp Vision
---
<div class="title hideforedit">
<h1 id="title"></h1>
</div>
<div class="text">
<div id="page-top">
<div id="pageToc">
<div class="pageToc">
<h2><span >What do end users expect?</span></h2>
<p><span >&nbsp;</span>End users expect their applications to install cleanly, meaning they install so the application runs successfully<em> and </em>the installation does not affect any other application already installed on the system.   They also expect that an application that runs on Windows, even an open source application, be fully supported on the platform, including using features that are unique to Windows.  These two basic tenants drive what needs to be supported in the creation of open source applications.</p>
<h2>What open source features do the Windows tools need to support?</h2>
<p>The open source community believes (with some merit) that their package management system is a superior tool for managing the installation, updating and removal of software.  Ian Murdock (founder of the Debian Linux distribution) has commented that package management is "the single biggest advancement Linux has brought to the industry", that it blurs the boundaries between operating system and applications, and that it makes it "easier to push new innovations [...] into the marketplace and [...] evolve the OS".</p>
</div>
</div>
<div id="topic">
<div id="pageText">
<div id="section_4">
<div id="section_2">
<p >&nbsp;</p>
<table width="90%" >
<tbody>
<tr>
<td valign="top" >
<p>(from Wikipedia article "<a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Package_management_system" title="http://en.wikipedia.org/wiki/Package_management_system" class=" external">Package Management Systems</a>")</p>
<p>A <strong>package management system</strong> is a collection of tools to automate the process of installing, upgrading, configuring, and removing <a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Software_package_(installation)" title="Software package (installation)" class=" external">software packages</a> from a <a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Computer" title="Computer" class=" external">computer</a>. Distributions of <a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Linux" title="Linux" class=" external">Linux</a> and other <a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Unix-like" title="Unix-like" class=" external">Unix-like</a> systems typically consist of hundreds or even thousands of distinct software packages; in the former case a package management system is nice, in the latter case it is essential.</p>
<p>Packages are distributions of software and <a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Metadata" title="Metadata" class=" external">metadata</a> such as the software's full name, description of its purpose, version number, vendor, <a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Checksum" title="Checksum" class=" external">checksum</a>, and a list of <a target="_blank" rel="external nofollow" href="http://en.wikipedia.org/wiki/Coupling_(computer_science)" title="Coupling (computer science)" class=" external">dependencies</a> necessary for the software to run properly. Upon installation, metadata is stored in a local <em>package database</em>.</p>
<p>A package management system provides a consistent method of installing software. A package management system is sometimes incorrectly referred to as an installer.</p>
</td>
</tr>
</tbody>
</table>
<p >&nbsp;</p>
<p >Nearly all Linux distributions employ some form of Package Management to redistribute applications for their system, either by using packages shipped on the installation disk image, or by obtaining packages from one or more known Package Repositories in real time.  These package management concepts are deeply embedded into the design of open source applications.</p>
<p >Windows must support these package management concepts to be a primary target for open source developers. The creation, distribution and management of packages need to be addressed in several ways:</p>
<p >&nbsp;</p>
<table width="90%" cellpadding="1" cellspacing="1" border="0" style="background: #e0e0e0; margin-left: 40px; table-layout: fixed;">
<tbody>
<tr>
<td width="200">
<p><strong>MSI Installers for Applications</strong></p>
</td>
<td>
<p>On Linux, the Package Management System handles the installation and removal of applications for the system administrator and ensures that appropriate dependencies are installed.  On Windows, we need to fill in the unique gaps that open source applications expose in managing applications with many dependencies.</p>
</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td>
<p><strong>Updatable applications, libraries and tools</strong></p>
</td>
<td>Similar to the benefits that Windows Update provides to Microsoft applications, open source applications should  be supported by a system that allows IT Pros to ensure their systems are kept up to date with patches, features and security fixes.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td>
<p><strong>Application and Library Repositories</strong></p>
</td>
<td>A distributed, standards based approach to for publishers to list their applications and libraries will provide open source applications visibility and respectability on the Windows Platform.</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
</div>
</div>
<div id="section_5">
<div id="section_3">
<h2><span id="What_Windows_features_does_the.c2.a0open_source_development_model.c2.a0need_to_support.3f">&nbsp;</span>What Windows features does the open source development model need to support?</h2>
<p>Because of its Linux/Unix roots, the open source software development model does not tend to support the preferred tools and methods that Windows developers generally use. One objective of CoApp is to better integrate Windows development tools and methods into the overall open source development methodology, helping to make Linux/Unix-centric open source development more platform agnostic.  This supports our overall goal of making Windows a primary build target for open source developers</p>
<table width="90%" cellpadding="1" cellspacing="1" border="0" style="background: #e0e0e0; margin-left: 40px; table-layout: fixed;">
<tbody>
<tr>
<td width="200"><strong>MSI Installers for Source files</strong></td>
<td>Providing MSI installers for source code and making support for our latest compilers and SDKs available to open source projects will encourage Windows developers to contribute to those projects, which in turn will deliver better support for open source applications on the Windows platform.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td><strong>Support x86/x64</strong></td>
<td>Supporting both the 32 bit and 64 bit Windows platforms will ensure that application adoption can happen on all our product SKUs.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td><strong>Signed Binaries</strong></td>
<td>By providing guidance and tools for digitally signing binaries, open source applications gain a measure of trust and validation, as well as opening the door for Windows-specific features such as WinSxS and Windows error reporting.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td><strong>Shared Libraries</strong></td>
<td>Currently open source applications on Windows do not share versions of dependent libraries, where they do on Linux. This leads inevitably to DLL Hell, compatibility issues, and worse--the potential for out-of-date or flawed libraries in use by applications.  We can provide guidance and tools to eliminate these issues and provide excellent support for applications.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td><strong>Automatic support for Dependencies</strong></td>
<td>Once we have laid the foundations for sharing dependencies, we also need to implement tools to make the process automatic ( &amp; scriptable)</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td><strong>Windows Side by Side support</strong></td>
<td>Side by side (WinSxS) support in Windows was designed to ensure that multiple versions of libraries can be installed at the same time, and serviced appropriately. Unfortunately this feature in Windows is difficult to master, and will require developer tools to simplify the process, and some client tools to ensure things don't get broken when installing, uninstalling and servicing applications.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td><strong>Windows Error Reporting</strong></td>
<td>Once Signed binaries are being generated, this enables developers to gain access to WinQual data, which will vastly improve the communities' ability to track down failures that are difficult to reproduce in development.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td><strong>Support for VS 2008, VS 2010 and beyond.</strong></td>
<td>Open source applications on Windows have a habit of not using recent developer tools, mainly because porting hand-crafted build scripts forward is problematic. Our solution includes tools to eliminate this source of trouble, and ensure software can be built with the most up-to-date technologies available.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td>
<p><strong>Source Code Server and</strong></p>
<p><strong>Debug Symbol Server</strong></p>
</td>
<td>As a goal to strive for in the future, the availability of public source and symbol servers will allow just-in-time debugging of open source applications.</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
</div>
</div>
<div id="section_6">
<div id="section_4">
<h2><span id="What_needs_to_be_built_in_order_to_enable_Open_Source_Applications_to_support_these_features.3f">&nbsp;</span>What needs to be built in order to enable Open Source Applications to support these features?</h2>
<h2></h2>
<div id="section_7">
<div id="section_5"><span id="A_number_of_on-going_services_are_required_to_build_and_sustain_a_community_around_CoApp.3a">&nbsp;</span>
<h3 class="editable">A number of on-going services are required to build and sustain a community around CoApp:</h3>
<table width="90%" cellpadding="1" cellspacing="1" border="0" style="background: #e0e0e0; margin-left: 40px; table-layout: fixed;">
<tbody>
<tr>
<td width="200"><strong>Shallow-Fork<br /> Source Repository<br /> </strong></td>
<td>A source code repository using appropriate version control software, that is used to maintain 'shallow-forks' --forked versions of open source projects, which are used to optimize Windows development.  If the original project chooses to support CoApp-style tools and development, these changes can be pushed back up to the project. In practice however, we know that some projects will not bother (they don't care about Windows support)</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>Directory of <br /> Package Repositories</strong></td>
<td>An Atom-Feed (similar to RSS) of repositories where signed CoApp-style packages can be found.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>Package Repository <br /> </strong></td>
<td>A Package repository is implemented another Atom-Feed that lists packages available on the server, along with serving the packages out as well.</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
</div>
</div>
<div id="section_8">
<div id="section_6"><span id="How-to_documents_which_explain_in_detail_the_processes_used_to_achieve_the_goals.3a">&nbsp;</span>
<h3 class="editable">How-to documents which explain in detail the processes used to achieve the goals:</h3>
<table width="90%" cellpadding="1" cellspacing="1" border="0" style="background: #e0e0e0; margin-left: 40px; table-layout: fixed;">
<tbody>
<tr>
<td width="200"><strong>Adopting and maintaining a 'shallow-fork'<br /> </strong></td>
<td>A document which describes the process for adopting and maintaining the shallow-forks.  This includes detailed examples on merging changes between branches in order to preserve fixes and updates in a the local repository.  This may also be expanded to include instructions how to push up bug-fixes upstream into the original project.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>Tracking original projects</strong></td>
<td>A document describing the service and process for detecting when changes in upstream projects have occurred and the triaging of changes.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200">
<p><strong>Building a CoApp </strong><br /> <strong>Compatible Package</strong></p>
</td>
<td>A document detailing the steps to build a CoApp compatible package using the CoApp developer tool-chain.</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
</div>
</div>
<div id="section_9">
<div id="section_7"><span id="A_developer_tool-chain_to_assist_in_application_and_automation_processes.3a">&nbsp;</span>
<h3 class="editable">A developer tool-chain to assist in application and automation processes:</h3>
<table width="90%" cellpadding="1" cellspacing="1" border="0" style="background: #e0e0e0; margin-left: 40px; table-layout: fixed;">
<tbody>
<tr>
<td width="200"><strong>ScanTool<br /> </strong></td>
<td>
<p>Collects knowledge about building a project from an existing build and source files.</p>
</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>mkSpec</strong></td>
<td>Creates specifications for building a target from Scanning and Prior Knowledge.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200">
<p><strong>mkTarget</strong></p>
</td>
<td>Creates VC Project/Solution files for building targets and their dependencies.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>TrainApp</strong></td>
<td>Automation tool for PGO training/relinking applications.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>SmartManifest</strong></td>
<td>Creates library and application manifests for SxS, and autogenerates appropriate Wix files..</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>mkPackage</strong></td>
<td>Generates packaged application and source MSI files.</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
</div>
</div>
<div id="section_10">
<div id="section_8"><span id="Tools_for_the_used_at_the_client_machine.3a">&nbsp;</span>
<h3 class="editable">Tools for the used at the client machine:</h3>
<table width="90%" cellpadding="1" cellspacing="1" border="0" style="background: #e0e0e0; margin-left: 40px; table-layout: fixed;">
<tbody>
<tr>
<td width="200"><strong>SharedLibraryConfig<br /> </strong></td>
<td>Performs maintenance and consistency checking for all shared libraries.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200"><strong>CommonInstaller</strong></td>
<td>A tool for getting applications, tools and libraries from Application Repositories.</td>
</tr>
<tr>
<td colspan="2">
<hr />
</td>
</tr>
<tr>
<td width="200">
<p><strong>UpdateService</strong></p>
</td>
<td>Downloads updates for Applications and Libraries.</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<p>&nbsp;</p>
